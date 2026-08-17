import { google } from "googleapis";
import { formatRFC3339 } from "@himanshu-sorathiya/datetime";

const oauth2Client = new google.auth.OAuth2(
	process.env["GOOGLE_CLIENT_ID"],
	process.env["GOOGLE_CLIENT_SECRET"],
	process.env["GOOGLE_REDIRECT_URI"],
);

/**
 * Initializes the Google Calendar API client with a user's refresh token.
 */
export function getCalendarClient(refreshToken: string) {
	oauth2Client.setCredentials({ refresh_token: refreshToken });
	return google.calendar({ version: "v3", auth: oauth2Client });
}

/**
 * Fetches free/busy information for a user's calendars.
 * Returns an array of busy time intervals.
 */
export async function getFreeBusy(
	refreshToken: string,
	timeMin: Date,
	timeMax: Date,
	calendarIds: string[] = ["primary"],
) {
	const calendar = getCalendarClient(refreshToken);

	const response = await calendar.freebusy.query({
		requestBody: {
			timeMin: formatRFC3339(timeMin),
			timeMax: formatRFC3339(timeMax),
			items: calendarIds.map((id) => ({ id })),
			// timezone is handled implicitly by RFC3339 format
		},
	});

	const calendars = response.data.calendars || {};
	const busySlots: { start: string; end: string }[] = [];

	for (const calId in calendars) {
		const busy = calendars[calId]?.busy;
		if (busy) {
			busySlots.push(
				...busy.map((b) => ({
					start: b.start as string,
					end: b.end as string,
				})),
			);
		}
	}

	return busySlots;
}

/**
 * Creates a calendar event with a Google Meet link.
 */
export async function createCalendarEvent(
	refreshToken: string,
	eventDetails: {
		summary: string;
		description?: string;
		startTime: Date;
		endTime: Date;
		attendeeEmail: string;
	},
) {
	const calendar = getCalendarClient(refreshToken);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const event: any = {
		summary: eventDetails.summary,
		start: {
			dateTime: formatRFC3339(eventDetails.startTime),
		},
		end: {
			dateTime: formatRFC3339(eventDetails.endTime),
		},
		attendees: [{ email: eventDetails.attendeeEmail }],
		conferenceData: {
			createRequest: {
				requestId: crypto.randomUUID(), // unique ID for creating the Meet
				conferenceSolutionKey: {
					type: "hangoutsMeet",
				},
			},
		},
	};

	if (eventDetails.description) {
		event.description = eventDetails.description;
	}

	const response = await calendar.events.insert({
		calendarId: "primary",
		requestBody: event,
		conferenceDataVersion: 1,
		sendUpdates: "all", // Send email invitations
	});

	return response.data;
}

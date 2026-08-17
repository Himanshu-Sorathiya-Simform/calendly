"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import { uiSpring } from "../../utils/motionUtils";

interface EventTypeCardProps {
	username: string;
	title: string;
	duration: number; // in minutes
	slug: string;
	description?: string | null;
}

export default function EventTypeCard({
	username,
	title,
	duration,
	slug,
	description,
}: EventTypeCardProps) {
	return (
		<Link href={`/${username}/${slug}`} className="block w-full">
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={uiSpring}
				className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-sm transition-all hover:border-ultramarine/30 hover:shadow-xl hover:shadow-ultramarine/10"
			>
				<h3 className="text-graphite text-2xl font-bold tracking-tight mb-3 transition-colors">{title}</h3>

				<div className="flex items-center gap-4 text-graphite font-medium mb-5 transition-colors">
					<div className="flex items-center gap-1.5 bg-black/5 px-3 py-1.5 rounded-full text-sm">
						<Clock className="h-4 w-4" />
						<span>{duration} mins</span>
					</div>
				</div>

				{description && (
					<p className="text-subtle transition-colors leading-relaxed line-clamp-2">
						{description}
					</p>
				)}

				{/* Decorative gradient removed in favor of structural fill */}
			</motion.div>
		</Link>
	);
}

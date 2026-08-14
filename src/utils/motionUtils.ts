import type { Transition } from "framer-motion";

export const uiSpring: Transition = {
	type: "spring",
	bounce: 0,
	duration: 0.4,
};

export const momentumSpring: Transition = {
	type: "spring",
	bounce: 0.2,
	duration: 0.4,
};

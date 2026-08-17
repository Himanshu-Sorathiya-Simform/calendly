"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";
import { uiSpring } from "../../utils/motionUtils";
import { cn } from "../../utils/styleUtils";

interface ModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}

export default function Modal({
	isOpen,
	onOpenChange,
	children,
	className,
}: ModalProps) {
	return (
		<DialogPrimitive.Root
			open={isOpen}
			onOpenChange={onOpenChange}
		>
			<AnimatePresence>
				{isOpen && (
					<DialogPrimitive.Portal forceMount>
						<DialogPrimitive.Overlay asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={uiSpring}
								className="bg-graphite/20 fixed inset-0 z-50 backdrop-blur-md"
							/>
						</DialogPrimitive.Overlay>
						<DialogPrimitive.Content
							asChild
							forceMount
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 10 }}
								transition={uiSpring}
								className={cn(
									"glass-heavy fixed top-[50%] left-[50%] z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl p-8 shadow-2xl shadow-black/10 focus:outline-none",
									className,
								)}
							>
								{children}
								<DialogPrimitive.Close className="focus:ring-ultramarine absolute top-6 right-6 rounded-full p-2 opacity-70 transition-colors hover:bg-black/5 hover:opacity-100 focus:ring-2 focus:outline-none disabled:pointer-events-none">
									<X className="text-graphite h-4 w-4" />
									<span className="sr-only">Close</span>
								</DialogPrimitive.Close>
							</motion.div>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				)}
			</AnimatePresence>
		</DialogPrimitive.Root>
	);
}

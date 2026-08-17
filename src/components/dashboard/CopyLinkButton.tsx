"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/styleUtils";

interface CopyLinkButtonProps {
	link: string;
	className?: string;
}

export default function CopyLinkButton({ link, className }: CopyLinkButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className={cn(
				"text-subtle hover:text-graphite flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors hover:bg-black/5",
				copied && "text-green-600 hover:text-green-700",
				className
			)}
		>
			<Copy className="h-4 w-4" />
			{copied ? "Copied!" : "Copy Link"}
		</button>
	);
}

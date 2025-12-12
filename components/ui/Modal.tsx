"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	label: string;
}

export function Modal({ isOpen, onClose, children, label }: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	// Handle open/close
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			previousActiveElement.current = document.activeElement as HTMLElement;
			dialog.showModal();
			document.body.style.overflow = "hidden";
		} else {
			dialog.close();
			document.body.style.overflow = "";
			previousActiveElement.current?.focus();
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// Handle Escape key (native dialog handles this, but we need to sync state)
	const handleCancel = useCallback(
		(e: React.SyntheticEvent) => {
			e.preventDefault();
			onClose();
		},
		[onClose],
	);

	if (!isOpen) return null;

	return (
		<dialog
			ref={dialogRef}
			onCancel={handleCancel}
			aria-label={label}
			aria-modal="true"
			className="fixed inset-0 w-full h-full max-w-none max-h-none bg-transparent p-0 m-0 backdrop:bg-background/90"
		>
			{/* Backdrop - clicking this closes the modal */}
			{/* biome-ignore lint/a11y/useSemanticElements: backdrop needs custom click handling */}
			<div
				role="button"
				tabIndex={0}
				className="fixed inset-0 flex items-center justify-center p-4"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
			>
				{/* Content wrapper - stop propagation to prevent closing when clicking content */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: stops click propagation to backdrop */}
				<div
					className="relative max-w-5xl w-full"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						type="button"
						onClick={onClose}
						className="absolute -top-12 right-0 text-foreground/80 hover:text-foreground p-2 z-10"
						aria-label="Close modal"
					>
						<svg
							className="w-8 h-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					{children}
				</div>
			</div>
		</dialog>
	);
}

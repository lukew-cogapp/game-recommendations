import type { ReactNode } from "react";

interface InfoRowProps {
	label: string;
	children: ReactNode;
}

export function InfoRow({ label, children }: InfoRowProps) {
	return (
		<div>
			<dt className="text-muted text-sm">{label}</dt>
			<dd className="text-foreground">{children}</dd>
		</div>
	);
}

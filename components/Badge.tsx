interface BadgeProps {
	children: React.ReactNode;
	variant?:
		| "default"
		| "success"
		| "warning"
		| "danger"
		| "info"
		| "success-muted"
		| "warning-muted"
		| "danger-muted";
	size?: "sm" | "md";
	className?: string;
}

const variantClasses = {
	default: "bg-border text-foreground",
	success: "bg-green-700 text-white",
	warning: "bg-gold text-background",
	danger: "bg-red-700 text-white",
	info: "bg-brown text-white",
	"success-muted": "bg-green-900/50 text-green-300",
	"warning-muted": "bg-gold/20 text-gold",
	"danger-muted": "bg-red-900/50 text-red-300",
};

const sizeClasses = {
	sm: "px-1.5 py-0.5 text-xs",
	md: "px-3 py-1 text-sm",
};

export function Badge({
	children,
	variant = "default",
	size = "sm",
	className = "",
}: BadgeProps) {
	return (
		<span
			className={`rounded font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
		>
			{children}
		</span>
	);
}

export function MetacriticBadge({
	score,
	muted = true,
}: {
	score: number;
	muted?: boolean;
}) {
	const baseVariant =
		score >= 75 ? "success" : score >= 50 ? "warning" : "danger";
	const variant = muted ? `${baseVariant}-muted` : baseVariant;
	return (
		<Badge variant={variant as BadgeProps["variant"]}>
			<span className="sr-only">Metacritic score: </span>
			{score}
		</Badge>
	);
}

export function UnreleasedBadge({ size = "sm" }: { size?: "sm" | "md" }) {
	return (
		<Badge variant="info" size={size}>
			Unreleased
		</Badge>
	);
}

export function PlatformBadge({ label }: { label: string }) {
	return <Badge>{label}</Badge>;
}

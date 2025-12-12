interface EmptyStateProps {
	message?: string;
	hint?: string;
}

export function EmptyState({
	message = "No games found",
	hint,
}: EmptyStateProps) {
	return (
		<output className="block text-center py-12">
			<p className="text-muted">{message}</p>
			{hint && <p className="text-muted/70 text-sm mt-2">{hint}</p>}
		</output>
	);
}

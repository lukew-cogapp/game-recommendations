interface EmptyStateProps {
	message?: string;
}

export function EmptyState({ message = "No games found" }: EmptyStateProps) {
	return (
		<output className="block text-center py-12 text-muted">{message}</output>
	);
}

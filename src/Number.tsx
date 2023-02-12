import { useState, useEffect } from "react";

// A component that displays a large number with a label and icon.

// Props:
// - label: the label to display
// - icon: the icon to display
// - value: the value to display

// animated to change to the new value
// - animate: whether to animate the change
// - animateDuration: the duration of the animation
// - animateEasing: the easing function to use for the animation

// typescript + tailwind

function NumberDisplay({
	label,
	icon,
	value,
	animate = true,
	animateDuration = 500,
	animateEasing = "ease-in-out",
	unit,
	style,
}: {
	label: string;
	icon?: string;
	value: number;
	animate?: boolean;
	animateDuration?: number;
	animateEasing?: string;
	unit?: string;
	style?: React.CSSProperties;
}) {
	const [displayValue, setDisplayValue] = useState(value);

	useEffect(() => {
		if (animate) {
			setDisplayValue(value);
		}
	}, [value]);

	return (
		<div className="flex flex-col items-center w-32" style={style}>
			<span className="text-4xl font-bold">
				{displayValue}
				<span className="text-lg">{unit}</span>
			</span>
			<span className="text-lg font-bold">{label}</span>
		</div>
	);
}

export default NumberDisplay;

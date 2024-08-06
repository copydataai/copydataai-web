import { LOCALE } from "@config";
import { Calendar } from "lucide-react";

interface DatetimesProps {
	pubDatetime: string | Date;
	modDatetime: string | Date | undefined | null;
}

interface Props extends DatetimesProps {
	size?: "sm" | "lg";
	className?: string;
}

export default function Datetime({
	pubDatetime,
	modDatetime,
	size = "sm",
	className = "",
}: Props) {
	return (
		<div
			className={`flex items-center space-x-2 opacity-80 ${className}`.trim()}
		>
			<Calendar className="inline-block h-6 w-6 min-w-[1.375rem]" />
			{modDatetime && modDatetime > pubDatetime ? (
				<span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
					Updated:
				</span>
			) : (
				<span className="sr-only">Published:</span>
			)}
			<span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
				<FormattedDatetime
					pubDatetime={pubDatetime}
					modDatetime={modDatetime}
				/>
			</span>
		</div>
	);
}

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimesProps) => {
	console.log("pubDatetime: ", pubDatetime);
	const myDatetime = new Date(
		modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime,
	);

	const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const time = myDatetime.toLocaleTimeString(LOCALE.langTag, {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<>
			<time dateTime={myDatetime.toISOString()}>{date}</time>
			<span aria-hidden="true"> | </span>
			<span className="sr-only">&nbsp;at&nbsp;</span>
			<span className="text-nowrap">{time}</span>
		</>
	);
};

import { IPlayerInfo } from "../../types";

import "./StartScreen.css";

const StartScreen: React.FC<{
	start: (file?: File | null) => void;
	saveNames: boolean | Record<string, IPlayerInfo | null>;
	setShowSaves: React.Dispatch<React.SetStateAction<boolean>>;
	updateSaves: () => Promise<void>;
}> = ({ start, saveNames, setShowSaves, updateSaves }) => {
	return (
		<div className="start-screen">
			<div className="start-screen__button" onClick={() => start()}>
				Play
			</div>
			{!!saveNames && (
				<div
					className="start-screen__button"
					onClick={() => {
						if (saveNames === true) {
							updateSaves().then(() => setShowSaves((prev) => !prev));
						} else {
							setShowSaves((prev) => !prev);
						}
					}}
				>
					Manage Saves
				</div>
			)}
			<a className="start-screen__manual-link" href="D1_manual_en.pdf" target="_blank" rel="noopener noreferrer">
				View Manual
			</a>
		</div>
	);
};

export default StartScreen;

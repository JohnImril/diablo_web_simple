import { IPlayerInfo } from "../../types";

import "./StartScreen.css";

const StartScreen: React.FC<{
	hasSpawn: boolean;
	start: (file?: File | null) => void;
	saveNames: boolean | Record<string, IPlayerInfo | null>;
	setCompress: React.Dispatch<React.SetStateAction<boolean>>;
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
		</div>
	);
};

export default StartScreen;

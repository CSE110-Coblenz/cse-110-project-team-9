import Konva from "konva";
import { SettingsScreenView } from "./SettingsScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;
	private currentVolume: number;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new SettingsScreenView();
		this.audio = new AudioController();
		this.currentVolume = this.audio.getVolume();
		this.volumeHandlers();

		/**
		 * Button Event Listeners
		 */

		this.view.getCloseButton().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "home" });
		});
	}

	private volumeHandlers(): void {
		const bgmSlider = this.view.getBgmSlider();
		const knob = bgmSlider.findOne<Konva.Circle>('Circle')!;

		knob.on('dragmove', () => {
			const fill = bgmSlider.findOne<Konva.Rect>('Rect')!;
			const ratio = fill.width() / 200;
			this.audio.changeVolume(ratio);
		});

		const saveButton = this.view.getSaveButton();
		saveButton.on('click', () => {
			this.audio.play('click');
			localStorage.setItem("volume", this.audio.getVolume().toString());
			this.view.hide();
		});
	}

	public onVolumeChange(newVolume: number): void {
        this.audio.changeVolume(newVolume);
    }

    public onSaveButtonClick(): void {
        this.audio.play("click");
    }

    public getCurrentVolume(): number {
        return this.currentVolume;
    }

    /**
     * Get the view
     */

	getView(): SettingsScreenView {
		return this.view;
	}
}

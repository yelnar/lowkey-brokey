import { useEffect } from "react";
import { useMainButton } from "@twa.js/sdk-react";

export function MainButton({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) {
  const mainButton = useMainButton();

  useEffect(() => {
    mainButton.on("click", onClick);
    mainButton.enable().show();

    return () => {
      mainButton.off("click", onClick);
      mainButton.hide();
    };
  }, [mainButton, onClick]);

  useEffect(() => {
    mainButton.setText(text);
  }, [mainButton, text]);

  return null;
}

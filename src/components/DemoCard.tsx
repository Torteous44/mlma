import React, { useState } from "react";
import styles from "./DemoCard.module.css";
import Button from "../ui/Button";
import DragDropUpload from "../ui/DragDropUpload";
import BackButton from "../ui/BackButton";

// Screen components
const ButtonScreen: React.FC<{
  onUploadClick: () => void;
  onManualClick: () => void;
}> = ({ onUploadClick, onManualClick }) => (
  <div className={styles.optionsContainer}>
    <div className={styles.optionItem}>
      <Button variant="primary" fullWidth size="large" onClick={onUploadClick}>
        Upload Document
      </Button>
    </div>
    <div className={styles.optionOr}>or</div>
    <div className={styles.optionItem}>
      <Button
        variant="secondary"
        fullWidth
        size="large"
        onClick={onManualClick}
      >
        Complete Manually
      </Button>
    </div>
  </div>
);

const UploadScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const handleFileSelected = (file: File) => {
    console.log("File selected:", file.name);
    // Process the file here
  };

  return (
    <div className={styles.uploadContainer}>
      <DragDropUpload
        onFileSelected={handleFileSelected}
        acceptedFileTypes="application/pdf,image/jpeg,image/png"
        maxFileSize={5242880} // 5MB
        primaryText="Select File to Upload"
        secondaryText="Drag and drop or click to select a file"
      />
    </div>
  );
};

const ManualScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className={styles.manualContainer}>
    <div className={styles.manualContent}>
      <p>Complete your information manually</p>
      <div className={styles.formPlaceholder}>
        {/* Form fields would go here */}
        <p>Form inputs will be displayed here</p>
      </div>
    </div>
  </div>
);

interface ScreenContent {
  title: string;
  guideText: string;
}

const DemoCard: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "buttons" | "upload" | "manual"
  >("buttons");
  const [animation, setAnimation] = useState<"fadeIn" | "fadeOut" | "none">(
    "none"
  );

  const screenContent: Record<"buttons" | "upload" | "manual", ScreenContent> =
    {
      buttons: {
        title: "Begin Your Mortgage Assessment",
        guideText: "Choose how you would like to proceed",
      },
      upload: {
        title: "Upload Your Data",
        guideText: "We'll extract the information automatically",
      },
      manual: {
        title: "Manual Information Entry",
        guideText: "Please fill out the required fields below",
      },
    };

  const handleTransition = (nextScreen: "buttons" | "upload" | "manual") => {
    // First fade out the current screen
    setAnimation("fadeOut");

    // After fadeOut animation completes, change the screen and fade in
    setTimeout(() => {
      setCurrentScreen(nextScreen);
      setAnimation("fadeIn");
    }, 50);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "upload":
        return <UploadScreen onBack={() => handleTransition("buttons")} />;
      case "manual":
        return <ManualScreen onBack={() => handleTransition("buttons")} />;
      default:
        return (
          <ButtonScreen
            onUploadClick={() => handleTransition("upload")}
            onManualClick={() => handleTransition("manual")}
          />
        );
    }
  };

  const { title, guideText } = screenContent[currentScreen];

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoCard}>
        <div className={styles.topContent}>
          <div className={styles.topHeader}>
            {currentScreen !== "buttons" && (
              <BackButton
                onClick={() => handleTransition("buttons")}
                className={styles.topBackButton}
                label=""
              />
            )}
            <h2 className={styles.demoTitle}>{title}</h2>
          </div>
          <p className={styles.guideText}>{guideText}</p>
        </div>
        <div className={styles.mainContent}>
          <div className={`${styles.screenContainer} ${styles[animation]}`}>
            {renderScreen()}
          </div>
        </div>
        <div className={styles.bottomContent}>
          <div className={styles.helpIcon}>?</div>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;

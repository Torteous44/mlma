import React from "react";
import styles from "./Landing.module.css";
import DemoCard from "../components/DemoCard";
import ScrollableContent from "../components/ScrollableContent";

const Landing = () => {
  return (
    <div className={styles.container}>
      <DemoCard />
      <ScrollableContent />
    </div>
  );
};

export default Landing;

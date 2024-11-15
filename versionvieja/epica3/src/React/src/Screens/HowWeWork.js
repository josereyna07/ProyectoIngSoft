import React from 'react'
import styles from "./HowWeWork.module.css";
import Step from '../Components/Step'

const HowWeWork = () => {
    const steps=[
        {
            text: "Ingresas.",
            id:1,
        },
        {
            text: "Creas tu perfil.",
            id:2,
        },
        {
            text: "Publicas tu documento.",
            id:3,
        },
        {
            text: "Recibes feedback.",
            id:4,
        },
    ];

  return (
    <div name="HowWeWork" className={styles.howWeWork}>
        <h2 className={styles.title}>¿Cómo Trabajamos?</h2>
        {
            steps.map(x => (
                <Step text={x.text} step={x.id} />
            ))
        }
    </div>
  );
};

export default HowWeWork
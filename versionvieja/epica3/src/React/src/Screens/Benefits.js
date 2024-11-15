import React from "react";
import styles from "./Benefits.module.css";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { FaPeopleCarry } from "react-icons/fa";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { AiOutlineRise } from "react-icons/ai";
import { FiRepeat } from "react-icons/fi";

const Benefits = () => {
  return (
    <div name="Benefits" className={styles.benefits}>
      <h2 className={styles.benefitTitle}>
        Beneficios de publicar en<br />
        <b>DocTIC</b>
      </h2>
      <p>
        Compartes tu conocimiento con el mundo. 
        <FaPeopleCarry />
      </p>
      <p>
        Obten público y clientes.
        <BsFillDoorOpenFill />
      </p>
      <p>
        {" "}
        Más fácil de utilizar. <FiRepeat />
      </p>
    </div>
  );
};

export default Benefits;
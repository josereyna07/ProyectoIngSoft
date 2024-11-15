import React from "react";
import styles from "./Contact.module.css";

const Contact = () => {
  return (
    <div name="Contact" className={styles.contact}>
      <h2>Contact</h2>
      <form
        className={styles.form}
      >
        <label for="Name">Name</label>
        <input id="Name" name="Name" className={styles.input}></input>
        <label for="Email">Email</label>
        <input
          id="Email"
          name="Email"
          type="Email"
          className={styles.input}
        ></input>
        <label for="Message">Message</label>
        <textarea id="Message" className={styles.textArea}></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact;
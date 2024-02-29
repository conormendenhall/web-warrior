import "./Messages.scss";

export const Messages = ({ messages }) => {
  return messages.map((message, index) => (
    <p className={"message"} key={index}>
      {message}
    </p>
  ));
};

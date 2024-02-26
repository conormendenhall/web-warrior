import "./StatusMessages.scss";

export const StatusMessages = ({ messages }) => {
  return messages.map((message, index) => (
    <p className={"status-message"} key={index}>{message}</p>
  ));
};

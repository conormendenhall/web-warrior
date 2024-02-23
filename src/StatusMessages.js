import "./StatusMessages.scss";

export const StatusMessages = ({ messages }) => {
  return messages.map((message) => (
    <p className={"status-message"}>{message}</p>
  ));
};

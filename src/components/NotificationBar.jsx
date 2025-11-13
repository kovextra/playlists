function NotificationBar({ notification }) {
  return (
    <div
      id="notifications"
      className={notification.type == "bad" ? "notify-bad" : "notify-good"}
    >
      {notification.message}
    </div>
  );
}
export default NotificationBar;

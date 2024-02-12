export const Health = ({ hp, maxHP }) => {
  return (
    <div className="health">
      <div className="health-count">
        {hp} / {maxHP} HP
      </div>
      <div className="health-bar">
        <div className="hp" style={{ width: (hp / maxHP) * 100 + "%" }}></div>
      </div>
    </div>
  );
};

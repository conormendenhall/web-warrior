import "./HeroStatus.scss";

export const HeroStatus = ({ heroStatus }) => {
  return (
    <div className="hero-status">
      {heroStatus.angelRounds > 0 && (
        <div className="effect">Angel's Blessing: {heroStatus.angelRounds}</div>
      )}
      {heroStatus.demonRounds > 0 && (
        <div className="effect">Demon's Wrath: {heroStatus.demonRounds}</div>
      )}
    </div>
  );
};

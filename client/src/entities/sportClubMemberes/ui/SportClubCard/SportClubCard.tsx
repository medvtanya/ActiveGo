import { useNavigate } from "react-router";

import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import type { SportClubType } from "@/entities/sportClub/model";

type Props = {
  sportClub: SportClubType;
};

export default function SportClubCard({ sportClub }: Props) {
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate(`${CLIENT_ROUTES.SPORT_CLUB}/${sportClub.id}`);
  };

  return (
    <div className="sport-club-card" onClick={navigateHandler}>
      <img src={sportClub.photo} alt={sportClub.title} />
      <h3>{sportClub.title}</h3>
      <p>{sportClub.openCommunity ? "Открытый клуб" : "Закрытый клуб"}</p>
      <p>{sportClub.city.city}</p>
      <p>{sportClub.sport.type}</p>
    </div>
  );
}

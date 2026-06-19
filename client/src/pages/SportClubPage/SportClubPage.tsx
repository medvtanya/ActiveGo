import { getAllSportClubsThunk } from "@/entities/sportClub/api/sportClubApi";
import SportClubCard from "@/entities/sportClub/ui/SportClubCard/SportClubCard";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./SportClubPage.css";
import { getAllSportClubMembersThunk } from "@/entities/sportClubMemberes/api/sportClubMemberesApi";

export default function SportClubPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sportClubs =
    useAppSelector((state) => state.sportClub.sportClubs) || [];
  const sportClubMembers = useAppSelector(
    (state) => state.sportClubMember.sportClubMembers
  );
  const user = useAppSelector((state) => state.user.user);

  const [activeTab, setActiveTab] = useState<"my" | "all" | "open" | "closed">(
    "my"
  );
  const [filteredClubs, setFilteredClubs] = useState(sportClubs);

  const navigateHandler = () => {
    navigate(CLIENT_ROUTES.CREATE_SPORT_CLUB);
  };

  useEffect(() => {
    try {
      dispatch(getAllSportClubsThunk());
      dispatch(getAllSportClubMembersThunk());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    filterClubs();
  }, [sportClubs, activeTab, user, sportClubMembers]);

  const filterClubs = () => {
    const myClubIds = sportClubMembers
      .filter((member) => member.user_id === user?.id)
      .map((member) => member.sportClub_id);

    let result = [...sportClubs];

    switch (activeTab) {
      case "my":
        result = user
          ? result.filter((club) => myClubIds.includes(club.id))
          : [];
        break;
      case "open":
        result = result.filter((club) => club.openCommunity);
        break;
      case "closed":
        result = result.filter((club) => !club.openCommunity);
        break;
      case "all":
      default:
        break;
    }

    setFilteredClubs(result);
  };

  const myClubIds = sportClubMembers
    .filter((member) => member.user_id === user?.id)
    .map((member) => member.sportClub_id);

  return (
    <div className="sport-club-page">
      <h1 className="sport-page-title">Спортивные клубы</h1>

      <div className="tab-menu">
        <button
          className={`tab-button ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
          data-count={
            user
              ? sportClubs.filter((club) => myClubIds.includes(club.id)).length
              : 0
          }
        >
          Мои клубы
        </button>
        <button
          className={`tab-button ${activeTab === "open" ? "active" : ""}`}
          onClick={() => setActiveTab("open")}
          data-count={sportClubs.filter((club) => club.openCommunity).length}
        >
          Открытые
        </button>
        <button
          className={`tab-button ${activeTab === "closed" ? "active" : ""}`}
          onClick={() => setActiveTab("closed")}
          data-count={sportClubs.filter((club) => !club.openCommunity).length}
        >
          Закрытые
        </button>
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
          data-count={sportClubs.length}
        >
          Все клубы
        </button>
      </div>

      <div className="clubs-list">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <SportClubCard key={club.id} sportClub={club} />
          ))
        ) : (
          <div className="no-clubs">
            {activeTab === "my"
              ? "Вы не состоите ни в одном клубе"
              : activeTab === "open"
              ? "Нет открытых клубов"
              : activeTab === "closed"
              ? "Нет закрытых клубов"
              : "Клубы не найдены"}
          </div>
        )}
      </div>

      <button className="confirm-btns" onClick={navigateHandler}>
        Создать клуб
      </button>
    </div>
  );
}

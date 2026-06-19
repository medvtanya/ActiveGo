import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import {
  getAllSportClubMembersThunk,
  updateSportClubMemberThunk,
  deleteSportClubMemberThunk,
} from "@/entities/sportClubMemberes/api/sportClubMemberesApi";
import { getAllSportClubsThunk } from "@/entities/sportClub/api/sportClubApi";
import { toast } from "react-toastify";
import "./AccessSportClub.css";
import { useLocation } from "react-router";

interface SportClubMemberWithDetails {
  id: number;
  sportClub_id: number;
  user_id: number;
  access: boolean;
  createdAt: string;
  user?: {
    id: number;
    userName: string;
    photo: string;
  };
  sportClub?: {
    id: number;
    title: string;
  };
}

export default function AccessSportClub() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clubId = Number(searchParams.get("clubId"));
  const [pendingRequests, setPendingRequests] = useState<
    SportClubMemberWithDetails[]
  >([]);

  const sportClubMembers = useAppSelector(
    (state) => state.sportClubMember.sportClubMembers
  );
  const sportClubs = useAppSelector((state) => state.sportClub.sportClubs);

  useEffect(() => {
    dispatch(getAllSportClubMembersThunk());
    dispatch(getAllSportClubsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!clubId) {
      setPendingRequests([]);
      return;
    }
    const pending = sportClubMembers
      .filter((member) => !member.access && member.sportClub_id === clubId)
      .map((member) => {
        const sportClub = sportClubs.find(
          (club) => club.id === member.sportClub_id
        );
        return {
          ...member,
          user: member.user,
          sportClub,
        };
      });
    setPendingRequests(pending);
  }, [sportClubMembers, sportClubs, clubId]);

  const handleAcceptRequest = async (memberId: number) => {
    try {
      await dispatch(
        updateSportClubMemberThunk({
          id: memberId,
          data: { access: true },
        })
      ).unwrap();

      await dispatch(getAllSportClubMembersThunk());
      toast.success("Заявка принята");
    } catch (error) {
      toast.error("Ошибка при принятии заявки");
      console.error("Accept request error:", error);
    }
  };

  const handleRejectRequest = async (memberId: number) => {
    try {
      await dispatch(deleteSportClubMemberThunk(memberId)).unwrap();
      await dispatch(getAllSportClubMembersThunk());
      toast.success("Заявка отклонена");
    } catch (error) {
      toast.error("Ошибка при отклонении заявки");
      console.error("Reject request error:", error);
    }
  };

  return (
    <div className="access-sport-club">
      <div className="access-container">
        <h2>Управление заявками на вступление в клуб</h2>

        {pendingRequests.length === 0 ? (
          <div className="no-requests">
            <p>Нет ожидающих заявок</p>
          </div>
        ) : (
          <div className="requests-list">
            {pendingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <div className="user-info">
                    <h3>
                      {request.user?.userName || "Неизвестный пользователь"}
                    </h3>
                    <p>ID пользователя: {request.user_id}</p>
                  </div>
                  <div className="club-info">
                    <h4>
                      Клуб: {request.sportClub?.title || "Неизвестный клуб"}
                    </h4>
                    <p>
                      Дата заявки:{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="accept-btn"
                  >
                    Принять заявку
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="reject-btn"
                  >
                    Отклонить заявку
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

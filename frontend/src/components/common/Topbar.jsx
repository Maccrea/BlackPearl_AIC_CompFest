import React, { useEffect, useState } from "react";
import {
  Menu,
  Clock,
  Bell,
  CircleHelp,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function Topbar({
  role = "admin",
  onMenuClick = null,
}) {
  const navigate = useNavigate();

  const displayRole =
    role.charAt(0).toUpperCase() + role.slice(1);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] =
    useState(false);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );

  const dateString = currentTime.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const notifications = dashboard.alerts || [];

  const unreadCount = notifications.length;

  const getNotificationIcon = (level) => {
    if (level === "critical") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EF4444]/10">
          <AlertTriangle
            size={17}
            className="text-[#EF4444]"
          />
        </div>
      );
    }

    if (level === "warning") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10">
          <AlertCircle
            size={17}
            className="text-[#F59E0B]"
          />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/10">
        <CheckCircle2
          size={17}
          className="text-[#10B981]"
        />
      </div>
    );
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false);

    if (notification.machineId) {
      navigate(
        `/operator/machine-detail/${notification.machineId}`
      );
    }
  };

  const handleHelpClick = () => {
    navigate(
      "/help"
    );
  };

  return (
    <header className="relative mb-8 flex w-full flex-col px-8 pt-6">

      <button
        onClick={onMenuClick}
        className="mb-5 w-fit text-[#6B7280] transition-colors hover:text-white"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>


      <div className="flex w-full items-end justify-between">

        <div>

          <h2 className="mb-1 text-[26px] font-bold text-white">
            Selamat Pagi, {displayRole} 👋
          </h2>

          <p className="text-[14px] text-[#8B95A7]">
            Berikut kondisi line produksi hari ini.
          </p>

        </div>


        <div className="flex items-center gap-4">

          <div className="flex h-[48px] items-center gap-3 rounded-xl border border-[#1F2937] bg-[#121620] px-4">

            <Clock
              size={18}
              className="text-[#9CA3AF]"
            />

            <div className="flex flex-col justify-center">

              <span className="text-[13px] font-bold leading-tight text-white">
                {timeString}
              </span>

              <span className="text-[11px] leading-tight text-[#8B95A7]">
                {dateString}
              </span>

            </div>

          </div>

          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="relative flex h-[48px] w-[48px] items-center justify-center rounded-xl border border-[#1F2937] bg-[#121620] text-[#9CA3AF] transition-colors hover:text-white"
              aria-label="Notifications"
            >

              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white ring-2 ring-[#121620]">
                  {unreadCount}
                </span>
              )}

            </button>

            {showNotifications && (

              <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620] shadow-2xl">

                <div className="flex items-center justify-between border-b border-[#1F2937] px-5 py-4">

                  <div>

                    <h3 className="font-bold text-white">
                      Notifications
                    </h3>

                    <p className="mt-1 text-xs text-[#8B95A7]">
                      Alert terbaru dari production line
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="text-[#6B7280] transition hover:text-white"
                  >
                    <X size={18} />
                  </button>

                </div>

                <div className="max-h-[360px] overflow-y-auto">

                  {notifications.length === 0 ? (

                    <div className="px-5 py-10 text-center">

                      <CheckCircle2
                        size={32}
                        className="mx-auto text-[#10B981]"
                      />

                      <p className="mt-3 text-sm font-medium text-white">
                        All systems normal
                      </p>

                      <p className="mt-1 text-xs text-[#8B95A7]">
                        Tidak ada alert aktif saat ini.
                      </p>

                    </div>

                  ) : (

                    notifications.map(
                      (notification) => (

                        <button
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className="flex w-full gap-3 border-b border-[#1F2937] px-5 py-4 text-left transition hover:bg-[#1A1F2D]"
                        >

                          {getNotificationIcon(
                            notification.level
                          )}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <p className="text-sm font-semibold text-white">
                                {notification.title}
                              </p>

                              <span className="shrink-0 text-[10px] text-[#6B7280]">
                                {notification.time}
                              </span>

                            </div>

                            <p className="mt-1 text-xs text-[#9CA3AF]">
                              {notification.machine}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                              {notification.message}
                            </p>

                          </div>

                        </button>

                      )
                    )

                  )}

                </div>

                {notifications.length > 0 && (

                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(
                        "/operator/machine-status"
                      );
                    }}
                    className="w-full border-t border-[#1F2937] px-5 py-3 text-center text-xs font-semibold text-[#A78BFA] transition hover:bg-[#1A1F2D]"
                  >
                    Lihat Semua Machine Status →
                  </button>

                )}

              </div>

            )}

          </div>


          <button
            onClick={handleHelpClick}
            className="flex h-[48px] items-center gap-2 rounded-xl bg-[#7C3AED] px-5 font-medium text-white transition-colors hover:bg-[#6D28D9]"
          >

            <CircleHelp size={18} />

            <span className="text-[14px]">
              Bantuan
            </span>

          </button>

        </div>

      </div>

    </header>
  );
}
"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type TabType = "free" | "proof";

type Message = {
  id: number;
  room: TabType;
  name: string;
  time: string;
  text: string;
  avatar: string;
  mine?: boolean;
  reaction?: number;
  image?: boolean;
  imageUrl?: string;
};

const freeMessages: Message[] = [
  { id: 1, room: "free", name: "김민지", time: "오후 2:10", text: "오늘 일본어 3일차 완료했어요 😊", avatar: "🐥", reaction: 3 },
  { id: 2, room: "free", name: "박지훈", time: "오후 2:13", text: "퇴근하고 공부하기 너무 힘드네요 ㅋㅋ", avatar: "🦁", reaction: 2 },
  { id: 3, room: "free", name: "최유진", time: "오후 2:15", text: "그래도 10분만 하면 되더라구요!", avatar: "🐰", reaction: 4 },
  { id: 4, room: "free", name: "이서연", time: "오후 2:18", text: "독일어 공부하시는 분 계신가요?", avatar: "🐱", reaction: 1 },
  { id: 5, room: "free", name: "한지우", time: "오후 2:20", text: "저는 토익 목표 800점인데 같이 공부하실 분?", avatar: "🐶", reaction: 5 },
  { id: 6, room: "free", name: "나", time: "오후 2:23", text: "와 감사합니다!! 🥰", avatar: "🙂", mine: true, reaction: 2 },
  { id: 7, room: "free", name: "정예린", time: "오후 2:25", text: "오늘도 다들 화이팅이에요 💪🔥", avatar: "🐻", reaction: 3 },
  { id: 8, room: "free", name: "박지훈", time: "오후 2:26", text: "화이팅!! 🔥🔥", avatar: "🦁", reaction: 1 },
];

const proofMessages: Message[] = [
  { id: 1, room: "proof", name: "오수빈", time: "오후 1:02", text: "오늘 1일차 인증합니다!", avatar: "🍊", reaction: 6, image: true },
  { id: 2, room: "proof", name: "문하늘", time: "오후 1:30", text: "점심시간에 10분 공부 완료 ✍️", avatar: "🦊", reaction: 4, image: true },
  { id: 3, room: "proof", name: "나", time: "오후 2:01", text: "저도 오늘 인증 완료!", avatar: "🙂", mine: true, reaction: 2, image: true },
  { id: 4, room: "proof", name: "김도아", time: "오후 2:12", text: "필기하면서 하니까 더 기억에 남네요!", avatar: "🐼", reaction: 5, image: true },
];

export default function MiniLoungePage() {
  const [activeTab, setActiveTab] = useState<TabType>("free");
  const [draft, setDraft] = useState("");
  const [customMessages, setCustomMessages] = useState<Message[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<number[]>([]);
  const [isPurchased] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const sendLockRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const baseMessages = activeTab === "free" ? freeMessages : proofMessages;
  const messages = [
    ...baseMessages,
    ...customMessages.filter((message) => message.room === activeTab),
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTab, messages.length]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSend = () => {
    if (sendLockRef.current) return;
    if (!draft.trim() && !imagePreview) return;

    sendLockRef.current = true;

    const now = new Date();
    const hour = now.getHours();
    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? "오후" : "오전";

    const nextMessage: Message = {
      id: Date.now(),
      room: activeTab,
      name: "나",
      time: `${period} ${displayHour}:${String(now.getMinutes()).padStart(2, "0")}`,
      text: draft.trim() || "오늘의 학습 인증",
      avatar: "🙂",
      mine: true,
      reaction: 0,
      image: Boolean(imagePreview) || activeTab === "proof",
      imageUrl: imagePreview || undefined,
    };

    setCustomMessages((prev) => [...prev, nextMessage]);
    setDraft("");
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      sendLockRef.current = false;
    }, 300);
  };

  return (
    <main className="flex h-screen flex-col bg-[#FFF8F5]">
      <header className="shrink-0 bg-white/95 px-5 pb-4 pt-5 shadow-sm">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-zinc-950">미니 라운지</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            혼자 공부하지 않도록, 미니학습지가 함께 있어요.
            <br />
            공부 이야기, 일상 이야기, 오늘의 학습 인증을 자유롭게 나눠보세요.
          </p>
        </div>
      </header>

      <nav className="shrink-0 bg-white/95">
        <div className="mx-auto grid max-w-4xl grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab("free")}
            className={`py-4 text-center text-base font-semibold ${activeTab === "free"
              ? "border-b-2 border-[#FF5100] text-[#FF5100]"
              : "text-zinc-400"
              }`}
          >
            미니 수다방
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("proof")}
            className={`py-4 text-center text-base font-semibold ${activeTab === "proof"
              ? "border-b-2 border-[#FF5100] text-[#FF5100]"
              : "text-zinc-400"
              }`}
          >
            학습 인증
          </button>
        </div>
      </nav>

      <section className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <div className="mx-auto rounded-full bg-black/15 px-4 py-1 text-sm text-white">
            오늘
          </div>

          {messages.map((message) => {
            const isLiked = likedMessages.includes(message.id);
            const isProofMessage = message.image;

            return (
              <div
                key={message.id}
                className={`flex gap-2 ${message.mine ? "items-end justify-end" : "items-start justify-start"
                  }`}
              >
                {!message.mine && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    {message.avatar}
                  </div>
                )}

                <div
                  className={`flex max-w-[74%] flex-col ${message.mine ? "items-end" : "items-start"
                    }`}
                >
                  {!message.mine && (
                    <div className="mb-1 flex items-center gap-2 px-1">
                      <span className="text-sm font-semibold text-zinc-800">
                        {message.name}
                      </span>
                      <span className="text-xs text-zinc-500">{message.time}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-sm ${message.mine && !isProofMessage
                      ? "rounded-br-md bg-[#FF5100] text-white"
                      : message.mine && isProofMessage
                        ? "rounded-br-md bg-white text-zinc-950"
                        : "rounded-bl-md bg-white text-zinc-950"
                      }`}
                  >
                    <p>{message.text}</p>

                    {message.image && (
                      <div className="mt-3 w-56 overflow-hidden rounded-xl bg-[#FFF2EB]">
                        {message.imageUrl ? (
                          <img
                            src={message.imageUrl}
                            alt="학습 인증 이미지"
                            className="h-36 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-36 items-center justify-center text-4xl">
                            {message.id % 2 === 0 ? "✍️" : "📚"}
                          </div>
                        )}

                        <div className="px-3 py-2 text-xs text-zinc-500">
                          오늘의 학습 인증
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={`mt-2 flex items-center gap-2 ${message.mine ? "justify-end" : "justify-start"
                      }`}
                  >
                    <button
                      onClick={() => {
                        setLikedMessages((prev) =>
                          prev.includes(message.id)
                            ? prev.filter((id) => id !== message.id)
                            : [...prev, message.id]
                        );
                      }}
                      className={`rounded-full px-2.5 py-1 text-xs shadow-sm transition ${isLiked
                        ? "bg-[#FFF2EB] text-[#FF5100]"
                        : "bg-white/90 text-zinc-700"
                        }`}
                    >
                      ❤️ {(message.reaction ?? 0) + (isLiked ? 1 : 0)}
                    </button>

                    {message.mine && (
                      <span className="text-xs text-zinc-500">{message.time}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </section>

      <footer className="shrink-0 border-t border-black/5 bg-white/95 px-4 py-3">
        {activeTab === "proof" && (
          <div className="mx-auto mb-3 max-w-4xl rounded-2xl border border-[#FFE1D2] bg-[#FFF2EB] p-4">
            <div className="font-semibold text-[#FF5100]">
              📚 오늘 학습 인증하기
            </div>

            <div className="mt-1 text-sm text-zinc-600">
              오늘 공부한 내용을 남겨보세요. 사진과 함께 인증할 수 있어요.
            </div>
          </div>
        )}

        {imagePreview && (
          <div className="mx-auto mb-3 flex max-w-4xl items-center gap-3 rounded-xl bg-[#FFF2EB] p-3">
            <img
              src={imagePreview}
              alt="첨부 이미지 미리보기"
              className="h-16 w-16 rounded-lg object-cover"
            />

            <div className="flex-1">
              <div className="text-sm font-semibold text-[#FF5100]">
                이미지가 첨부되었어요
              </div>
              <div className="text-xs text-zinc-500">
                전송하면 학습 인증 이미지로 등록됩니다.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="rounded-full bg-white px-3 py-1 text-xs text-zinc-500"
            >
              삭제
            </button>
          </div>
        )}

        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-2xl ${imagePreview
              ? "border-[#FF5100] bg-[#FFF2EB] text-[#FF5100]"
              : "border-zinc-200 text-zinc-500"
              }`}
          >
            +
          </button>

          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;

              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
            className="h-11 flex-1 rounded-full border border-zinc-200 px-5 text-sm outline-none placeholder:text-zinc-400"
            placeholder="메시지를 입력하세요"
          />

          <button
            type="button"
            onClick={handleSend}
            className="h-11 rounded-xl bg-[#FF5100] px-5 font-semibold text-white"
          >
            전송
          </button>
        </div>
      </footer>
    </main>
  );
}
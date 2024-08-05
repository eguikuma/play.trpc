import { Animated } from "../components";

export const Busyness = () => (
  <div className="flex justify-center items-center h-dvh bg-gray-100 overflow-hidden relative">
    <div className="bg-white p-8 rounded-lg shadow-xl z-10 text-center flex flex-col gap-y-4">
      <h1 className="flex flex-row gap-x-3 items-center justify-center font-bold text-gray-800 mb-4">
        <span className="text-2xl md:text-4xl inline-block animate-spin">
          🛠️
        </span>
        <span className="text-2xl lg:text-3xl">メンテナンス中</span>
        <span className="text-2xl md:text-4xl inline-block animate-spin">
          🛠️
        </span>
      </h1>
      <div className="text-xl text-gray-600 flex flex-col gap-y-2">
        <p className="font-bold">気長に待ってね</p>
        <p className="text-sm">
          もう少しお昼寝したいです<span>💤</span>
        </p>
      </div>
      <Animated />
    </div>
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
    </div>
  </div>
);

const webRtc = [
  {
    path: "/webrtc",
    name: "WebRTC",
    meta: { title: "menu.webrtc", icon: "VideoCameraFilled" },
    redirect: { name: "WebRTCTakePhotos" },
    children: [
      {
        path: "/take-photos",
        name: "WebRTCTakePhotos",
        meta: { title: "menu.webrtc_photo", icon: "CameraFilled" },
        component: () => import("@/views/webrtc/takePhotos.vue"),
      },
    ],
  },
];
export default webRtc;

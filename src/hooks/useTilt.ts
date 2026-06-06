import { useRef, useCallback, type MouseEvent } from 'react';

/**
 * 3D 倾斜 + 鼠标光斑位置 hook
 * 返回 ref 绑到容器, onMouseMove/onMouseLeave 绑到容器
 * 容器将自动应用 CSS variable: --rx, --ry, --mx, --my
 *   --rx, --ry: rotateX/rotateY 的 deg 值
 *   --mx, --my: 鼠标在容器内的归一化位置 (0~1), 用于定位光斑
 */
export function useTilt(maxAngle = 8) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width;   // 0~1
      const py = y / rect.height;  // 0~1
      const rx = (0.5 - py) * maxAngle;  // 上下 → rotateX
      const ry = (px - 0.5) * maxAngle;  // 左右 → rotateY
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
    },
    [maxAngle]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

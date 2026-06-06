import { useCursor } from '../../hooks/useCursor';

/**
 * 自定义光标 (含 ambient glow)
 * 始终挂载, 由 useCursor 内部根据视口宽度决定是否启用
 */
export function Cursor() {
  const { cursorRef, glowRef, enabled } = useCursor();

  return (
    <>
      <div
        ref={glowRef}
        className="cursor-glow"
        aria-hidden="true"
        style={{ opacity: enabled ? undefined : 0 }}
      />
      <div
        ref={cursorRef}
        className="custom-cursor"
        aria-hidden="true"
        style={{ opacity: enabled ? undefined : 0 }}
      >
        <div className="cursor-ring" />
        <div className="cursor-dot" />
      </div>
    </>
  );
}

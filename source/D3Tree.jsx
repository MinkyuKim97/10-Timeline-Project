import React, { useMemo, useState } from "react";
import * as d3 from "d3";

const getId = (n) => n.data?.value ?? n.data?.name ?? `${n.depth}-${n.index}`;

export default function D3Tree({
  data,
  width = 960,
  height = 600,
  nodeSize = [56, 160], // [vertical gap, horizontal gap]
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
}) {
  const [collapsed, setCollapsed] = useState(new Set());
  const [hovered, setHovered] = useState(null);

  const root = useMemo(() => {
    const h = d3.hierarchy(data);

    h.eachBefore((n) => {
      n._hasChildren = Array.isArray(n.children) && n.children.length > 0;
      if (collapsed.has(getId(n))) n.children = null;
    });

    return d3.tree().nodeSize(nodeSize)(h);
  }, [data, nodeSize, collapsed]);

  const nodes = root.descendants();
  const links = root.links();

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} style={{ border: "1px solid #eee" }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* 간선 */}
        {links.map((link, i) => (
          <path
            key={i}
            d={d3
              .linkHorizontal()
              .x((d) => d.y)
              .y((d) => d.x)({
                source: link.source,
                target: link.target,
              })}
            fill="none"
            stroke="#c0c0c0"
            strokeWidth={1.5}
          />
        ))}

        {/* 노드 */}
        {nodes.map((n) => {
          const id = getId(n);
          const isCollapsed = collapsed.has(id);
          return (
            <g
              key={id}
              transform={`translate(${n.y},${n.x})`}
              style={{ cursor: n._hasChildren ? "pointer" : "default" }}
              onMouseMove={(e) => {
                setHovered({ data: n.data, px: e.nativeEvent.offsetX, py: e.nativeEvent.offsetY });
              }}
              onMouseEnter={(e) => {
                setHovered({ data: n.data, px: e.nativeEvent.offsetX, py: e.nativeEvent.offsetY });
              }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (!n._hasChildren) return;
                setCollapsed((prev) => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next;
                });
              }}
            >
              <rect x={-70} y={-18} width={140} height={36} rx={8} fill="#b8b8b8" />
              <text textAnchor="middle" dy="0.35em" fontSize={12}>
                {n.data?.name}
              </text>

              {n._hasChildren && (
                <text x={-78} y={4} fontSize={14} textAnchor="end" pointerEvents="none">
                  {isCollapsed ? "▶" : "▼"}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            left: hovered.px + 12,
            top: hovered.py + 12,
            width: 260,
            background: 'white',
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
            padding: 10,
            pointerEvents: 'none',
          }}
        >
          {hovered.data?.img && (
            <img
              src={hovered.data.img}
              alt={hovered.data?.name ? `${hovered.data.name} thumbnail` : 'thumbnail'}
              style={{
                width: '100%',
                maxHeight: 160,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.15)',
                marginBottom: 8,
              }}
              loading="lazy"
            />
          )}
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            {hovered.data?.name}
          </div>
          {hovered.data?.date && (
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <b>Date:</b> {hovered.data.date}
            </div>
          )}
          {hovered.data?.value && (
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <b>Description:</b> {hovered.data.value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

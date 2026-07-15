"use client";

import { ExternalLink, MapPinned, Route } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import {
  buildGoogleDirectionsUrl,
  getDayMapRoutes,
  type RoutePlanSelection
} from "./routeMapData";
import styles from "./trip.module.css";

interface DayRouteMapProps {
  day: number;
  plan: RoutePlanSelection;
  active: boolean;
}

export function DayRouteMap({ day, plan, active }: DayRouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routes = useMemo(() => getDayMapRoutes(day, plan), [day, plan]);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!active || !containerRef.current || routes.length === 0) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    async function initialiseMap() {
      try {
        const L = await import("leaflet");
        if (cancelled || !containerRef.current) return;

        mapRef.current?.remove();
        const map = L.map(containerRef.current, {
          attributionControl: true,
          keyboard: true,
          scrollWheelZoom: false,
          zoomControl: true
        });
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        const bounds: Array<[number, number]> = [];

        routes.forEach((route) => {
          const coordinates = route.points.map((point) => [point.lat, point.lng] as [number, number]);
          bounds.push(...coordinates);

          L.polyline(coordinates, {
            color: route.color,
            dashArray: route.dashed ? "9 9" : undefined,
            lineCap: "round",
            lineJoin: "round",
            opacity: 0.88,
            weight: route.id === "common" ? 5 : 4
          }).addTo(map);

          route.points.forEach((point, index) => {
            const icon = L.divIcon({
              className: styles.routeMapMarkerShell,
              html: `<span style="--marker-color:${route.color}">${index + 1}</span>`,
              iconAnchor: [15, 15],
              iconSize: [30, 30]
            });

            L.marker([point.lat, point.lng], { icon })
              .bindTooltip(`${route.label} · ${index + 1}. ${point.label}`, {
                direction: "top",
                offset: [0, -11],
                opacity: 0.96
              })
              .addTo(map);
          });
        });

        if (bounds.length === 1) {
          map.setView(bounds[0], 14);
        } else if (bounds.length > 1) {
          map.fitBounds(bounds, { maxZoom: 15, padding: [34, 34] });
        }

        resizeObserver = new ResizeObserver(() => map.invalidateSize({ pan: false }));
        resizeObserver.observe(containerRef.current);
        window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
        setMapError(false);
      } catch {
        setMapError(true);
      }
    }

    void initialiseMap();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [active, routes]);

  if (routes.length === 0) return null;

  const routeSummary = routes
    .map((route) => `${route.label}：${route.points.map((point) => point.label).join(" → ")}`)
    .join("；");

  return (
    <section className={styles.routeMapCard} aria-label={`Day ${day} 路線地圖`}>
      <header className={styles.routeMapHeader}>
        <div>
          <span className={styles.routeMapEyebrow}><MapPinned size={15} aria-hidden="true" />DAY {day} ROUTE MAP</span>
          <h4 className={styles.routeMapTitle}>當日地面移動路線</h4>
        </div>
        <div className={styles.routeMapLegend} aria-label="路線圖例">
          {routes.map((route) => (
            <span className={styles.routeMapLegendItem} key={route.id}>
              <i style={{ "--route-color": route.color } as CSSProperties} data-dashed={route.dashed ? "true" : "false"} />
              {route.label}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.routeMapFrame}>
        <div
          className={styles.routeMapCanvas}
          ref={containerRef}
          role="img"
          aria-label={routeSummary}
        >
          <span className={styles.routeMapLoading}>{mapError ? "地圖暫時未能載入" : "載入路線地圖中…"}</span>
        </div>
      </div>

      <div className={styles.routeMapFooter}>
        <p>
          <Route size={16} aria-hidden="true" />
          線條顯示到訪次序；實際道路、鐵路及步行路線以出發當日導航為準。
        </p>
        <div className={styles.routeMapActions}>
          {routes.map((route) => (
            <a
              className={styles.mapButton}
              href={buildGoogleDirectionsUrl(route)}
              key={route.id}
              rel="noreferrer"
              target="_blank"
            >
              {routes.length > 1 ? `${route.label}：` : ""}Google Maps
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <ol className={styles.visuallyHidden}>
        {routes.flatMap((route) =>
          route.points.map((point, index) => (
            <li key={`${route.id}-${index}-${point.label}`}>
              {route.label}第 {index + 1} 站：{point.label}
            </li>
          ))
        )}
      </ol>
    </section>
  );
}

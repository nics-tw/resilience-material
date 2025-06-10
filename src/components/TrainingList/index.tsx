import React from "react";
import data from "./data.json";
import VerticalTable from "@site/src/components/VerticalTable";
import YoutubeEmbed from "@site/src/components/YoutubeEmbed";

export interface TrainingItem {
  name: string;
  link: string;
  sha256: string;
  youtube?: string;
}

export interface TrainingListProps {
  year: number | string;
}

export default function TrainingList({ year }: TrainingListProps) {
  const items = (data as Record<string, TrainingItem[]>)[year];
  if (!items || items.length === 0) {
    return <p>無資料</p>;
  }
  return (
    <>
      {items.map((item, idx) => (
        <VerticalTable
          key={item.link || idx}
          data={{
            課程影片: <a href={item.link}>{item.name}</a>,
            SHA256: item.sha256,
            ...(item.youtube
              ? { 教學影片: <YoutubeEmbed videoId={item.youtube} /> }
              : {}),
          }}
        />
      ))}
    </>
  );
}

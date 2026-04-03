import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../lib/theme";
import type { Topic, Exam } from "../store/useCourseStore";

interface ZigzagPathProps {
  topics: Topic[];
  exams: Exam[];
}

const NODE_SIZE = 28;
const BOSS_NODE_SIZE = 32;
const VERTICAL_OFFSET = 18;

function nodeColor(status: Topic["status"]) {
  switch (status) {
    case "mastered":
      return colors.success;
    case "in_progress":
      return colors.primary;
    case "locked":
      return colors.border;
  }
}

export default function ZigzagPath({ topics, exams }: ZigzagPathProps) {
  const { width: screenWidth } = useWindowDimensions();
  const hasUndefeatedExam = exams.some((e) => !e.defeated);

  const totalNodes = topics.length + (hasUndefeatedExam ? 1 : 0);
  if (totalNodes === 0) return null;

  // Calculate horizontal spacing to fit all nodes
  const availableWidth = screenWidth - 160; // card padding + button area
  const nodeSpacing = Math.max(NODE_SIZE + 4, availableWidth / totalNodes);
  const containerHeight = NODE_SIZE + VERTICAL_OFFSET * 2 + 8;
  const centerY = containerHeight / 2;

  // Build node positions
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < totalNodes; i++) {
    const x = i * nodeSpacing + NODE_SIZE / 2;
    const y = centerY + (i % 2 === 0 ? -VERTICAL_OFFSET : VERTICAL_OFFSET);
    positions.push({ x, y });
  }

  return (
    <View style={[styles.container, { height: containerHeight, width: totalNodes * nodeSpacing }]}>
      {/* Draw connector lines between nodes */}
      {positions.map((pos, i) => {
        if (i === 0) return null;
        const prev = positions[i - 1];
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        const fullLength = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Shorten line by the radius of each node so it stops at the circle border
        const prevRadius = NODE_SIZE / 2;
        const currRadius = (i < topics.length) ? NODE_SIZE / 2 : BOSS_NODE_SIZE / 2;
        const shortenTotal = prevRadius + currRadius;
        const lineLength = Math.max(0, fullLength - shortenTotal);

        // Offset the start point along the direction by prevRadius
        const unitX = dx / fullLength;
        const unitY = dy / fullLength;
        const startX = prev.x + unitX * prevRadius;
        const startY = prev.y + unitY * prevRadius;

        // Determine line color from destination node
        let lineColor: string;
        if (i < topics.length) {
          lineColor = nodeColor(topics[i].status);
        } else {
          lineColor = colors.danger;
        }

        return (
          <View
            key={`line-${i}`}
            style={{
              position: "absolute",
              left: startX,
              top: startY - 1,
              width: lineLength,
              height: 2,
              backgroundColor: lineColor,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: "left center",
            }}
          />
        );
      })}

      {/* Draw topic nodes */}
      {topics.map((topic, i) => {
        const pos = positions[i];
        const isMastered = topic.status === "mastered";
        const isInProgress = topic.status === "in_progress";
        const isLocked = topic.status === "locked";

        return (
          <View
            key={topic.id}
            style={[
              styles.node,
              {
                position: "absolute",
                left: pos.x - NODE_SIZE / 2,
                top: pos.y - NODE_SIZE / 2,
              },
              isMastered && styles.nodeMastered,
              isInProgress && styles.nodeInProgress,
              isLocked && styles.nodeLocked,
            ]}
          >
            {isMastered ? (
              <Text style={styles.checkText}>{"\u2713"}</Text>
            ) : (
              <Text style={[styles.numberText, isLocked && styles.numberTextLocked]}>
                {i + 1}
              </Text>
            )}
          </View>
        );
      })}

      {/* Draw boss node */}
      {hasUndefeatedExam && (
        <View
          style={[
            styles.bossNode,
            {
              position: "absolute",
              left: positions[totalNodes - 1].x - BOSS_NODE_SIZE / 2,
              top: positions[totalNodes - 1].y - BOSS_NODE_SIZE / 2,
            },
          ]}
        >
          <Text style={styles.bossEmoji}>{"\uD83D\uDC79"}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeMastered: {
    backgroundColor: colors.success,
  },
  nodeInProgress: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "rgba(155,109,255,0.1)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeLocked: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  checkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  numberText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  numberTextLocked: {
    color: colors.text3,
  },
  bossNode: {
    width: BOSS_NODE_SIZE,
    height: BOSS_NODE_SIZE,
    borderRadius: BOSS_NODE_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: "rgba(255,87,87,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bossEmoji: {
    fontSize: 16,
  },
});

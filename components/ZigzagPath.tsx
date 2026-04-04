import React, { useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Line, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { colors } from "../lib/theme";
import type { Topic, Exam } from "../store/useCourseStore";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

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

/** Animated beam connector between two nodes */
function BeamConnector({
  x1,
  y1,
  x2,
  y2,
  lineColor,
  status,
  index,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lineColor: string;
  status: "mastered" | "in_progress" | "locked" | "boss";
  index: number;
}) {
  // Traveling particle for in_progress
  const particleProgress = useSharedValue(0);
  // Pulsing glow for mastered
  const glowOpacity = useSharedValue(0.3);
  // Boss pulse
  const bossOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (status === "in_progress") {
      particleProgress.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
    }
    if (status === "mastered") {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
    if (status === "boss") {
      bossOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [status, particleProgress, glowOpacity, bossOpacity]);

  // Animated particle position
  const particleProps = useAnimatedProps(() => ({
    cx: x1 + (x2 - x1) * particleProgress.value,
    cy: y1 + (y2 - y1) * particleProgress.value,
  }));

  // Animated glow line opacity
  const glowLineProps = useAnimatedProps(() => ({
    strokeOpacity: glowOpacity.value,
  }));

  // Boss glow line opacity
  const bossLineProps = useAnimatedProps(() => ({
    strokeOpacity: bossOpacity.value,
  }));

  if (status === "locked") {
    // Dim static line, no animation
    return (
      <>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.border}
          strokeWidth={1.5}
          strokeOpacity={0.3}
          strokeDasharray="4,4"
        />
      </>
    );
  }

  if (status === "mastered") {
    // Pulsing glow beam
    return (
      <>
        {/* Base line */}
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.success}
          strokeWidth={2}
          strokeOpacity={0.6}
        />
        {/* Glow layer */}
        <AnimatedLine
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.success}
          strokeWidth={6}
          animatedProps={glowLineProps}
        />
      </>
    );
  }

  if (status === "boss") {
    // Pulsing red beam
    return (
      <>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.danger}
          strokeWidth={2}
          strokeOpacity={0.5}
        />
        <AnimatedLine
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.danger}
          strokeWidth={6}
          animatedProps={bossLineProps}
        />
      </>
    );
  }

  // in_progress — traveling particle
  return (
    <>
      {/* Base dim line */}
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colors.primary}
        strokeWidth={2}
        strokeOpacity={0.3}
      />
      {/* Traveling particle */}
      <AnimatedCircle
        r={4}
        fill={colors.primaryLight}
        animatedProps={particleProps}
        opacity={0.9}
      />
      {/* Particle glow */}
      <AnimatedCircle
        r={8}
        fill={colors.primary}
        animatedProps={particleProps}
        opacity={0.3}
      />
    </>
  );
}

export default function ZigzagPath({ topics, exams }: ZigzagPathProps) {
  const { width: screenWidth } = useWindowDimensions();
  const hasUndefeatedExam = exams.some((e) => !e.defeated);

  const totalNodes = topics.length + (hasUndefeatedExam ? 1 : 0);
  if (totalNodes === 0) return null;

  // Calculate horizontal spacing to fit all nodes
  const availableWidth = screenWidth - 160;
  const nodeSpacing = Math.max(NODE_SIZE + 4, availableWidth / totalNodes);
  const containerHeight = NODE_SIZE + VERTICAL_OFFSET * 2 + 8;
  const centerY = containerHeight / 2;
  const containerWidth = totalNodes * nodeSpacing;

  // Build node positions
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < totalNodes; i++) {
    const x = i * nodeSpacing + NODE_SIZE / 2;
    const y = centerY + (i % 2 === 0 ? -VERTICAL_OFFSET : VERTICAL_OFFSET);
    positions.push({ x, y });
  }

  return (
    <View style={[styles.container, { height: containerHeight, width: containerWidth }]}>
      {/* SVG layer for animated beams */}
      <Svg
        width={containerWidth}
        height={containerHeight}
        style={StyleSheet.absoluteFill}
      >
        {positions.map((pos, i) => {
          if (i === 0) return null;
          const prev = positions[i - 1];

          // Shorten line by node radii
          const dx = pos.x - prev.x;
          const dy = pos.y - prev.y;
          const fullLength = Math.sqrt(dx * dx + dy * dy);
          const prevRadius = NODE_SIZE / 2;
          const currRadius = i < topics.length ? NODE_SIZE / 2 : BOSS_NODE_SIZE / 2;
          const unitX = dx / fullLength;
          const unitY = dy / fullLength;
          const startX = prev.x + unitX * prevRadius;
          const startY = prev.y + unitY * prevRadius;
          const endX = pos.x - unitX * currRadius;
          const endY = pos.y - unitY * currRadius;

          // Determine beam status
          let status: "mastered" | "in_progress" | "locked" | "boss";
          let lineColor: string;
          if (i < topics.length) {
            status = topics[i].status;
            lineColor = nodeColor(topics[i].status);
          } else {
            status = "boss";
            lineColor = colors.danger;
          }

          return (
            <BeamConnector
              key={`beam-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              lineColor={lineColor}
              status={status}
              index={i}
            />
          );
        })}
      </Svg>

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

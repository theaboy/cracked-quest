import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import type { Topic, Exam } from "../store/useCourseStore";

interface ZigzagPathProps {
  topics: Topic[];
  exams: Exam[];
}

const NODE_SIZE = 28;
const BOSS_NODE_SIZE = 32;
const CONNECTOR_LENGTH = 24;
const CONNECTOR_ANGLE = 25;

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
  const hasUndefeatedExam = exams.some((e) => !e.defeated);

  // Build list of renderable nodes
  const nodes: Array<
    | { kind: "topic"; topic: Topic; index: number }
    | { kind: "boss" }
  > = topics.map((topic, index) => ({ kind: "topic" as const, topic, index }));

  if (hasUndefeatedExam) {
    nodes.push({ kind: "boss" as const });
  }

  return (
    <View style={styles.container}>
      {nodes.map((node, i) => {
        const isOdd = i % 2 !== 0;
        const marginTop = isOdd ? -16 : 16;

        // Connector to THIS node (drawn before the node, except for first)
        let connector: React.ReactNode = null;
        if (i > 0) {
          const connectorColor =
            node.kind === "boss"
              ? colors.danger
              : nodeColor(node.topic.status);

          const prevIsOdd = (i - 1) % 2 !== 0;
          // Going from even->odd means going up, odd->even means going down
          const rotation = prevIsOdd ? `${CONNECTOR_ANGLE}deg` : `-${CONNECTOR_ANGLE}deg`;

          connector = (
            <View
              style={[
                styles.connector,
                {
                  backgroundColor: connectorColor,
                  transform: [{ rotate: rotation }],
                },
              ]}
            />
          );
        }

        if (node.kind === "boss") {
          return (
            <React.Fragment key="boss">
              {connector}
              <View style={[styles.bossNode, { marginTop }]}>
                <Text style={styles.bossEmoji}>{"\uD83D\uDC79"}</Text>
              </View>
            </React.Fragment>
          );
        }

        const { topic, index } = node;
        const isMastered = topic.status === "mastered";
        const isInProgress = topic.status === "in_progress";
        const isLocked = topic.status === "locked";

        const nodeStyles = [
          styles.node,
          { marginTop },
          isMastered && styles.nodeMastered,
          isInProgress && styles.nodeInProgress,
          isLocked && styles.nodeLocked,
        ];

        return (
          <React.Fragment key={topic.id}>
            {connector}
            <View style={nodeStyles}>
              {isMastered ? (
                <Text style={styles.checkText}>{"\u2713"}</Text>
              ) : (
                <Text
                  style={[
                    styles.numberText,
                    isLocked && styles.numberTextLocked,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
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
  connector: {
    width: CONNECTOR_LENGTH,
    height: 2,
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

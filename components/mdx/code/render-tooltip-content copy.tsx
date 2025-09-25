import React from 'react';
import * as motion from 'motion/react-client';
// import highlightCode from './code-highlighter';
import InlineCode from './code-inline';
// import { TooltipMDXContentSync } from './tooltip-mdx-content';
import { MarkdownRenderer } from '../parse';
import type { SymbolMetadata } from './transformers/types';

type TooltipMeta = SymbolMetadata;

function TooltipHeader({ meta }: { meta: TooltipMeta }) {
  // Handle parameter
  if (meta.kind === 'parameter') {
    return (
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="px-4 py-2 bg-linear-to-r from-[oklch(0.98_0.02_162)] to-[oklch(0.96_0.04_162)]
            dark:from-[oklch(0.15_0.06_162)] dark:to-[oklch(0.12_0.08_162)]
            text-[oklch(0.45_0.15_162)] dark:text-[oklch(0.85_0.1_162)]
            rounded-full text-xs font-semibold border border-[oklch(0.9_0.05_162)]/60
            dark:border-[oklch(0.25_0.08_162)]/60 shadow-lg backdrop-blur-xl
            hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            parameter
          </motion.div>
          <motion.div
            className="px-4 py-2 bg-linear-to-r from-[oklch(0.98_0.02_162)] to-[oklch(0.94_0.06_162)]
            dark:from-[oklch(0.15_0.06_162)] dark:to-[oklch(0.10_0.1_162)]
            rounded-full border border-[oklch(0.9_0.05_162)]/60
            dark:border-[oklch(0.25_0.08_162)]/60 shadow-lg backdrop-blur-xl
            hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="font-bold text-base bg-linear-to-r from-[oklch(0.45_0.15_162)]
            to-[oklch(0.4_0.18_200)] dark:from-[oklch(0.85_0.1_162)]
            dark:to-[oklch(0.8_0.12_200)] bg-clip-text text-transparent">
              {meta.name}
            </div>
          </motion.div>
        </div>

        {/* Modern parameter signature */}
        {meta.label && (
          <motion.div
            className="font-mono text-sm bg-linear-to-r from-[oklch(0.99_0.01_200)]
            to-[oklch(0.97_0.02_220)]/90 dark:from-[oklch(0.12_0.02_200)]/90
            dark:to-[oklch(0.08_0.03_220)]/80 border border-[oklch(0.92_0.02_200)]/80
            dark:border-[oklch(0.2_0.04_200)]/60 rounded-2xl px-6 py-4 shadow-xl
            backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.2
            }}
          >
            <div className="text-[oklch(0.3_0.05_200)] dark:text-[oklch(0.85_0.02_200)]">
              <InlineCode>{`[language="python" meta="/[teal!]${meta.name}/"] ${meta.label}`}</InlineCode>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Handle variable
  if (meta.kind === 'variable') {
    return (
      <motion.div
        className="mb-6 flex items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        <motion.div
          className="px-4 py-2 bg-linear-to-r from-[oklch(0.98_0.02_292)] to-[oklch(0.96_0.04_292)]
          dark:from-[oklch(0.15_0.06_292)] dark:to-[oklch(0.12_0.08_292)]
          text-[oklch(0.45_0.15_292)] dark:text-[oklch(0.85_0.1_292)]
          rounded-full text-xs font-semibold border border-[oklch(0.9_0.05_292)]/60
          dark:border-[oklch(0.25_0.08_292)]/60 shadow-lg backdrop-blur-xl
          hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          variable
        </motion.div>

        <motion.div
          className="font-bold bg-linear-to-r from-[oklch(0.98_0.02_292)]/90
          to-[oklch(0.94_0.06_292)]/70 dark:from-[oklch(0.15_0.06_292)]/40
          dark:to-[oklch(0.10_0.1_292)]/30 px-4 py-2 rounded-xl
          border border-[oklch(0.9_0.05_292)]/50 dark:border-[oklch(0.25_0.08_292)]/50
          shadow-lg backdrop-blur-xl hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1
          }}
          whileHover={{ scale: 1.02 }}
        >
          <MarkdownRenderer className="text-[oklch(0.4_0.18_292)] dark:text-[oklch(0.8_0.12_292)]">
            {`[purple!]${meta.name}`}
          </MarkdownRenderer>
        </motion.div>
      </motion.div>
    );
  }

  // Handle expression
  if (meta.kind === 'expression') {
    return (
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="px-4 py-2 bg-linear-to-r from-[oklch(0.98_0.02_182)] to-[oklch(0.96_0.04_162)]
            dark:from-[oklch(0.15_0.06_182)] dark:to-[oklch(0.12_0.08_162)]
            text-[oklch(0.35_0.15_182)] dark:text-[oklch(0.85_0.1_182)]
            rounded-full text-xs font-semibold border border-[oklch(0.9_0.05_182)]/60
            dark:border-[oklch(0.25_0.08_182)]/60 shadow-lg backdrop-blur-xl
            hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            expression
          </motion.div>
        </div>

        {/* Expression code block */}
        <motion.div
          className="font-mono text-sm font-semibold bg-linear-to-r
          from-[oklch(0.98_0.02_182)]/90 to-[oklch(0.96_0.04_162)]/70
          dark:from-[oklch(0.15_0.06_182)]/40 dark:to-[oklch(0.12_0.08_162)]/30
          rounded-2xl px-6 py-4 shadow-xl backdrop-blur-2xl
          hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1
          }}
          whileHover={{ y: -2 }}
        >
          <div className="break-all text-[oklch(0.35_0.15_182)] dark:text-[oklch(0.85_0.1_182)]">
            <MarkdownRenderer>{`[language="python" meta="/[cyan!]${meta.name}/"] ${meta.name}`}</MarkdownRenderer>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Function/method/class style
  const displayName = meta.title || meta.name;

  const getKindStyles = (kind: string) => {
    switch (kind) {
      case 'function':
        return {
          badge: {
            bg: 'from-[oklch(0.98_0.02_65)] to-[oklch(0.95_0.05_50)]',
            bgDark: 'dark:from-[oklch(0.15_0.08_65)] dark:to-[oklch(0.12_0.1_50)]',
            text: 'text-[oklch(0.4_0.15_60)] dark:text-[oklch(0.85_0.1_60)]',
            border: 'border-[oklch(0.9_0.05_60)]/60 dark:border-[oklch(0.25_0.08_60)]/60'
          },
          title: 'from-[oklch(0.4_0.15_60)] to-[oklch(0.35_0.18_45)] dark:from-[oklch(0.85_0.1_60)] dark:to-[oklch(0.8_0.12_45)]',
        };
      case 'method':
        return {
          badge: {
            bg: 'from-[oklch(0.98_0.02_292)] to-[oklch(0.96_0.04_272)]',
            bgDark: 'dark:from-[oklch(0.15_0.06_292)] dark:to-[oklch(0.12_0.08_272)]',
            text: 'text-[oklch(0.45_0.15_292)] dark:text-[oklch(0.85_0.1_292)]',
            border: 'border-[oklch(0.9_0.05_292)]/60 dark:border-[oklch(0.25_0.08_292)]/60'
          },
          title: 'from-[oklch(0.45_0.15_292)] to-[oklch(0.4_0.18_272)] dark:from-[oklch(0.85_0.1_292)] dark:to-[oklch(0.8_0.12_272)]'
        };
      case 'class':
        return {
          badge: {
            bg: 'from-[oklch(0.98_0.02_212)] to-[oklch(0.96_0.04_232)]',
            bgDark: 'dark:from-[oklch(0.15_0.06_212)] dark:to-[oklch(0.12_0.08_232)]',
            text: 'text-[oklch(0.4_0.15_212)] dark:text-[oklch(0.85_0.1_212)]',
            border: 'border-[oklch(0.9_0.05_212)]/60 dark:border-[oklch(0.25_0.08_212)]/60'
          },
          title: 'from-[oklch(0.4_0.15_212)] to-[oklch(0.35_0.18_232)] dark:from-[oklch(0.85_0.1_212)] dark:to-[oklch(0.8_0.12_232)]'
        };
      default:
        return {
          badge: {
            bg: 'from-[oklch(0.98_0.01_200)] to-[oklch(0.96_0.02_220)]',
            bgDark: 'dark:from-[oklch(0.15_0.02_200)] dark:to-[oklch(0.12_0.03_220)]',
            text: 'text-[oklch(0.4_0.05_200)] dark:text-[oklch(0.85_0.02_200)]',
            border: 'border-[oklch(0.9_0.02_200)]/60 dark:border-[oklch(0.25_0.04_200)]/60'
          },
          title: 'from-[oklch(0.4_0.05_200)] to-[oklch(0.35_0.08_220)] dark:from-[oklch(0.85_0.02_200)] dark:to-[oklch(0.8_0.04_220)]'
        };
    }
  };

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          bg: 'from-[oklch(0.98_0.02_142)] to-[oklch(0.95_0.05_162)]',
          bgDark: 'dark:from-[oklch(0.15_0.08_142)] dark:to-[oklch(0.12_0.1_162)]',
          text: 'text-[oklch(0.4_0.15_142)] dark:text-[oklch(0.85_0.1_142)]',
          border: 'border-[oklch(0.9_0.05_142)]/60 dark:border-[oklch(0.25_0.08_142)]/60'
        };
      case 'medium':
        return {
          bg: 'from-[oklch(0.98_0.03_65)] to-[oklch(0.95_0.06_45)]',
          bgDark: 'dark:from-[oklch(0.15_0.08_65)] dark:to-[oklch(0.12_0.1_45)]',
          text: 'text-[oklch(0.4_0.15_65)] dark:text-[oklch(0.85_0.1_65)]',
          border: 'border-[oklch(0.9_0.05_65)]/60 dark:border-[oklch(0.25_0.08_65)]/60'
        };
      case 'hard':
        return {
          bg: 'from-[oklch(0.98_0.02_15)] to-[oklch(0.95_0.05_345)]',
          bgDark: 'dark:from-[oklch(0.15_0.08_15)] dark:to-[oklch(0.12_0.1_345)]',
          text: 'text-[oklch(0.4_0.15_15)] dark:text-[oklch(0.85_0.1_15)]',
          border: 'border-[oklch(0.9_0.05_15)]/60 dark:border-[oklch(0.25_0.08_15)]/60'
        };
      default:
        return {
          bg: 'from-[oklch(0.98_0.01_200)] to-[oklch(0.96_0.02_220)]',
          bgDark: 'dark:from-[oklch(0.15_0.02_200)] dark:to-[oklch(0.12_0.03_220)]',
          text: 'text-[oklch(0.4_0.05_200)] dark:text-[oklch(0.85_0.02_200)]',
          border: 'border-[oklch(0.9_0.02_200)]/60 dark:border-[oklch(0.25_0.04_200)]/60'
        };
    }
  };

  const kindStyles = getKindStyles(meta.kind);
  const difficultyStyles = meta.difficulty ? getDifficultyStyles(meta.difficulty) : null;

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          className={`px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-xl
          bg-linear-to-r ${kindStyles.badge.bg} ${kindStyles.badge.bgDark}
          ${kindStyles.badge.text} border ${kindStyles.badge.border}
          hover:shadow-xl transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`font-bold text-xs bg-linear-to-r ${kindStyles.title} bg-clip-text text-transparent`}>
            {meta.kind}
          </div>
        </motion.div>
        {meta.difficulty && difficultyStyles && (
          <motion.div
            className={`px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-xl
            bg-linear-to-r ${difficultyStyles.bg} ${difficultyStyles.bgDark}
            ${difficultyStyles.text} border ${difficultyStyles.border}
            hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {meta.difficulty}
          </motion.div>
        )}
      </div>
      <motion.div
        className={`font-bold text-2xl bg-linear-to-r ${kindStyles.title} bg-clip-text text-transparent mb-4`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.15
        }}
      >
        {displayName}
      </motion.div>
      {/* Modern function signature */}
      {meta.label && (
        <motion.div
          className="font-mono text-sm bg-linear-to-r from-[oklch(0.99_0.01_200)]
          to-[oklch(0.97_0.02_220)]/90 dark:from-[oklch(0.12_0.02_200)]/90
          dark:to-[oklch(0.08_0.03_220)]/80 border border-[oklch(0.92_0.02_200)]/80
          dark:border-[oklch(0.2_0.04_200)]/60 rounded-2xl px-6 py-4 shadow-xl
          backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2
          }}
          whileHover={{ y: -2 }}
        >
          <div className="text-[oklch(0.3_0.05_200)] dark:text-[oklch(0.85_0.02_200)] break-all">
            <InlineCode>{`[language="python" meta="/[yellow!]${meta.name}/"] ${meta.label}`}</InlineCode>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function TooltipDescription({ meta }: { meta: TooltipMeta }) {
  // Parameter description
  if (meta.kind === 'parameter' && meta.summary) {
    return (
      <motion.div
        className="text-sm mb-6 p-6 bg-linear-to-r from-[oklch(0.98_0.02_162)]/85
        to-[oklch(0.96_0.04_162)]/65 dark:from-[oklch(0.15_0.06_162)]/40
        dark:to-[oklch(0.12_0.08_162)]/25 border border-[oklch(0.92_0.03_162)]/60
        dark:border-[oklch(0.22_0.06_162)]/40 rounded-2xl shadow-xl backdrop-blur-2xl
        hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={{ y: -2 }}
      >
        <div className="text-[oklch(0.35_0.12_162)] dark:text-[oklch(0.85_0.08_162)] font-medium leading-relaxed">
          <MarkdownRenderer>{meta.summary}</MarkdownRenderer>
        </div>
      </motion.div>
    );
  }

  // Variable description
  if (meta.kind === 'variable' && meta.summary) {
    return (
      <motion.div
        className="text-sm mb-6 p-6 bg-linear-to-r from-[oklch(0.98_0.02_292)]/85
        to-[oklch(0.96_0.04_292)]/65 dark:from-[oklch(0.15_0.06_292)]/40
        dark:to-[oklch(0.12_0.08_292)]/25 border border-[oklch(0.92_0.03_292)]/60
        dark:border-[oklch(0.22_0.06_292)]/40 rounded-2xl shadow-xl backdrop-blur-2xl
        hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={{ y: -2 }}
      >
        <div className="text-[oklch(0.35_0.15_292)] dark:text-[oklch(0.85_0.1_292)] font-medium leading-relaxed">
          <MarkdownRenderer>{meta.summary}</MarkdownRenderer>
        </div>
      </motion.div>
    );
  }

  // Expression description
  if (meta.kind === 'expression' && meta.summary) {
    return (
      <motion.div
        className="text-sm mb-6 p-6 bg-linear-to-r from-[oklch(0.98_0.02_182)]/85
        to-[oklch(0.96_0.04_162)]/65 dark:from-[oklch(0.15_0.06_182)]/40
        dark:to-[oklch(0.12_0.08_162)]/25 border border-[oklch(0.92_0.03_182)]/60
        dark:border-[oklch(0.22_0.06_182)]/40 rounded-2xl shadow-xl backdrop-blur-2xl
        hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={{ y: -2 }}
      >
        <div className="text-[oklch(0.3_0.12_182)] dark:text-[oklch(0.85_0.08_182)] font-medium leading-relaxed">
          <MarkdownRenderer>
            {meta.summary}
          </MarkdownRenderer>
        </div>
      </motion.div>
    );
  }

  // Function/method definition, summary, and intuition
  if (meta.definition || meta.summary || meta.intuition) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
      >
        {meta.summary && (
          <motion.div
            className="text-sm p-6 bg-linear-to-r from-[oklch(0.99_0.01_200)]/85 to-[oklch(0.97_0.02_220)]/65
            dark:from-[oklch(0.12_0.02_200)]/40 dark:to-[oklch(0.08_0.03_220)]/25
            border border-[oklch(0.92_0.02_200)]/60 dark:border-[oklch(0.2_0.04_200)]/40
            rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-[oklch(0.4_0.05_200)] dark:bg-[oklch(0.85_0.02_200)] rounded-full shadow-sm"></div>
              <div className="font-bold text-[oklch(0.3_0.05_200)] dark:text-[oklch(0.9_0.02_200)] text-xs uppercase tracking-wider">Summary</div>
            </div>
            <MarkdownRenderer className="text-[oklch(0.25_0.03_200)] dark:text-[oklch(0.85_0.02_200)] leading-relaxed">
              {meta.summary}
            </MarkdownRenderer>
          </motion.div>
        )}
        {meta.definition && (
          <motion.div
            className="text-sm p-6 bg-linear-to-r from-[oklch(0.98_0.02_212)]/85 to-[oklch(0.96_0.04_232)]/65
            dark:from-[oklch(0.15_0.06_212)]/40 dark:to-[oklch(0.12_0.08_232)]/25
            border border-[oklch(0.92_0.03_212)]/60 dark:border-[oklch(0.22_0.06_212)]/40
            rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-[oklch(0.4_0.15_212)] dark:bg-[oklch(0.85_0.1_212)] rounded-full shadow-sm"></div>
              <div className="font-bold text-[oklch(0.35_0.12_212)] dark:text-[oklch(0.9_0.08_212)] text-xs uppercase tracking-wider">Definition</div>
            </div>
            <MarkdownRenderer className="text-[oklch(0.3_0.12_212)] dark:text-[oklch(0.85_0.08_212)] leading-relaxed">
              {meta.definition}
            </MarkdownRenderer>
          </motion.div>
        )}
        {meta.intuition && (
          <motion.div
            className="text-sm p-6 bg-linear-to-r from-[oklch(0.98_0.02_182)]/85 via-[oklch(0.97_0.03_200)]/75
            to-[oklch(0.96_0.04_162)]/65 dark:from-[oklch(0.15_0.06_182)]/40 dark:via-[oklch(0.13_0.05_200)]/35
            dark:to-[oklch(0.12_0.08_162)]/25 border border-[oklch(0.92_0.03_182)]/60
            dark:border-[oklch(0.22_0.06_182)]/40 rounded-2xl shadow-xl backdrop-blur-2xl
            hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-[oklch(0.35_0.15_182)] dark:bg-[oklch(0.85_0.1_182)] rounded-full shadow-sm"></div>
              <div className="font-bold text-[oklch(0.3_0.12_182)] dark:text-[oklch(0.9_0.08_182)] text-xs uppercase tracking-wider">Intuition</div>
            </div>
            <div className="px-2">
              <MarkdownRenderer className="text-[oklch(0.25_0.1_182)] dark:text-[oklch(0.85_0.08_182)] leading-relaxed">
                {meta.intuition}
              </MarkdownRenderer>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return null;
}

function createTooltipParameters(allMetadata: Record<string, SymbolMetadata>) {
  return function TooltipParameters({ meta }: { meta: TooltipMeta }) {
    if (!meta.args || !Array.isArray(meta.args) || meta.args.length === 0) {
      return null;
    }

    // Check if any parameters have documentation
    const hasDocumentedParams = meta.args.some(arg => {
      const paramQname = `${meta.name}:${meta.name}.${arg}`;
      const paramMeta = allMetadata[paramQname];
      return paramMeta?.label || paramMeta?.summary;
    });

    if (!hasDocumentedParams) {
      return null;
    }

    return (
      <motion.div
        className="text-sm mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 bg-[oklch(0.4_0.15_162)] dark:bg-[oklch(0.85_0.1_162)] rounded-full shadow-sm"></div>
          <div className="font-bold text-[oklch(0.35_0.12_162)] dark:text-[oklch(0.9_0.08_162)] text-xs uppercase tracking-wider">Parameters</div>
        </div>
        <div className="space-y-4">
          {meta.args.map((arg, index) => {
            // Build qualified name for parameter lookup
            // Format: "function_name:function_name.parameter_name"
            const paramQname = `${meta.name}:${meta.name}.${arg}`;
            const paramMeta = allMetadata[paramQname];

            // Only render if there's documentation
            if (!paramMeta?.label && !paramMeta?.summary) {
              return null;
            }

            return (
              <motion.div
                key={arg}
                className="p-5 bg-linear-to-r from-[oklch(0.98_0.02_162)]/85 to-[oklch(0.96_0.04_162)]/65
                dark:from-[oklch(0.15_0.06_162)]/40 dark:to-[oklch(0.12_0.08_162)]/25
                border border-[oklch(0.92_0.03_162)]/60 dark:border-[oklch(0.22_0.06_162)]/40
                rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {paramMeta?.label && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-4 py-2 bg-[oklch(0.96_0.03_162)]/90
                    dark:bg-[oklch(0.18_0.08_162)]/70 text-[oklch(0.3_0.12_162)] dark:text-[oklch(0.85_0.08_162)]
                    rounded-xl text-xs font-medium border border-[oklch(0.9_0.04_162)]/60
                    dark:border-[oklch(0.25_0.08_162)]/60 shadow-lg backdrop-blur-xl">
                      <InlineCode>{`[language="python" meta="/[teal!]${paramMeta.name}/"] ${paramMeta.label}`}</InlineCode>
                    </span>
                  </div>
                )}
                {paramMeta?.summary && (
                  <div className="text-[oklch(0.3_0.1_162)] dark:text-[oklch(0.85_0.06_162)] leading-relaxed">
                    <MarkdownRenderer>{paramMeta.summary}</MarkdownRenderer>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };
}

function TooltipReturns({ meta }: { meta: TooltipMeta }) {
  return meta.returns?.summary ? (
    <motion.div
      className="text-sm mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-[oklch(0.4_0.15_262)] dark:bg-[oklch(0.85_0.1_262)] rounded-full shadow-sm"></div>
        <div className="font-bold text-[oklch(0.35_0.12_262)] dark:text-[oklch(0.9_0.08_262)] text-xs uppercase tracking-wider">Returns</div>
      </div>
      <motion.div
        className="p-5 bg-linear-to-r from-[oklch(0.98_0.02_262)]/85 to-[oklch(0.96_0.04_262)]/65
        dark:from-[oklch(0.15_0.06_262)]/40 dark:to-[oklch(0.12_0.08_262)]/25
        border border-[oklch(0.92_0.03_262)]/60 dark:border-[oklch(0.22_0.06_262)]/40
        rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
        whileHover={{ y: -2 }}
      >
        <div className="space-y-3">
          {meta.returns.label && (
            <span className="inline-flex items-center font-mono text-[oklch(0.3_0.12_262)] dark:text-[oklch(0.85_0.08_262)]
            font-medium px-4 py-2 bg-[oklch(0.96_0.03_262)]/90 dark:bg-[oklch(0.18_0.08_262)]/70
            rounded-xl border border-[oklch(0.9_0.04_262)]/60 dark:border-[oklch(0.25_0.08_262)]/60
            text-sm shadow-lg backdrop-blur-xl">
              {meta.returns.label}
            </span>
          )}
          <div className="text-[oklch(0.3_0.1_262)] dark:text-[oklch(0.85_0.06_262)] leading-relaxed">
            <MarkdownRenderer>{meta.returns.summary}</MarkdownRenderer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  ) : null;
}

function createTooltipVariables(allMetadata: Record<string, SymbolMetadata>) {
  return function TooltipVariables({ meta }: { meta: TooltipMeta }) {
    if (!meta.variables || !Array.isArray(meta.variables) || meta.variables.length === 0) {
      return null;
    }

    // Check if any variables have documentation
    const hasDocumentedVars = meta.variables.some(variable => {
      const variableQname = `${meta.name}:${meta.name}.${variable}`;
      const variableMeta = allMetadata[variableQname];
      return variableMeta?.summary;
    });

    if (!hasDocumentedVars) {
      return null;
    }

    return (
      <motion.div
        className="text-sm mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 bg-[oklch(0.45_0.15_292)] dark:bg-[oklch(0.85_0.1_292)] rounded-full shadow-sm"></div>
          <div className="font-bold text-[oklch(0.4_0.12_292)] dark:text-[oklch(0.9_0.08_292)] text-xs uppercase tracking-wider">Variables</div>
        </div>
        <div className="space-y-4">
          {meta.variables.map((variable, index) => {
            // Build qualified name for variable lookup
            // Format: "function_name:function_name.variable_name"
            const variableQname = `${meta.name}:${meta.name}.${variable}`;
            const variableMeta = allMetadata[variableQname];

            // Only render if there's documentation
            if (!variableMeta?.summary) {
              return null;
            }

            return (
              <motion.div
                key={variable}
                className="p-5 bg-linear-to-r from-[oklch(0.98_0.02_292)]/85 to-[oklch(0.96_0.04_292)]/65
                dark:from-[oklch(0.15_0.06_292)]/40 dark:to-[oklch(0.12_0.08_292)]/25
                border border-[oklch(0.92_0.03_292)]/60 dark:border-[oklch(0.22_0.06_292)]/40
                rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center font-mono text-[oklch(0.3_0.15_292)] dark:text-[oklch(0.85_0.1_292)]
                  font-medium px-4 py-2 bg-[oklch(0.96_0.03_292)]/90 dark:bg-[oklch(0.18_0.08_292)]/70
                  rounded-xl border border-[oklch(0.9_0.04_292)]/60 dark:border-[oklch(0.25_0.08_292)]/60
                  text-sm shadow-lg backdrop-blur-xl">
                    {variable}
                  </span>
                </div>
                <div className="text-[oklch(0.3_0.12_292)] dark:text-[oklch(0.85_0.08_292)] leading-relaxed">
                  <MarkdownRenderer>
                    {variableMeta.summary}
                  </MarkdownRenderer>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };
}

function TooltipTimeComplexity({ meta }: { meta: TooltipMeta }) {
  return meta.time_complexity ? (
    <motion.div
      className="text-sm mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-[oklch(0.4_0.15_45)] dark:bg-[oklch(0.85_0.1_45)] rounded-full shadow-sm"></div>
        <div className="font-bold text-[oklch(0.35_0.12_45)] dark:text-[oklch(0.9_0.08_45)] text-xs uppercase tracking-wider">Time Complexity</div>
      </div>
      <motion.div
        className="p-5 bg-linear-to-r from-[oklch(0.98_0.02_45)]/85 to-[oklch(0.96_0.04_65)]/65
        dark:from-[oklch(0.15_0.06_45)]/40 dark:to-[oklch(0.12_0.08_65)]/25
        border border-[oklch(0.92_0.03_45)]/60 dark:border-[oklch(0.22_0.06_45)]/40
        rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
        whileHover={{ y: -2 }}
      >
        <MarkdownRenderer className="text-[oklch(0.3_0.12_45)] dark:text-[oklch(0.85_0.08_45)] leading-relaxed">
          {meta.time_complexity}
        </MarkdownRenderer>
      </motion.div>
    </motion.div>
  ) : null;
}

function TooltipTopics({ meta }: { meta: TooltipMeta }) {
  return meta.topics && Array.isArray(meta.topics) && meta.topics.length > 0 ? (
    <motion.div
      className="text-sm mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, staggerChildren: 0.05 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-[oklch(0.35_0.15_162)] dark:bg-[oklch(0.85_0.1_162)] rounded-full shadow-sm"></div>
        <div className="font-bold text-[oklch(0.3_0.12_162)] dark:text-[oklch(0.9_0.08_162)] text-xs uppercase tracking-wider">Topics</div>
      </div>
      <div className="flex flex-wrap gap-3">
        {meta.topics.map((topic, idx) => (
          <motion.span
            key={topic || idx}
            className="inline-flex items-center px-4 py-2 bg-linear-to-r from-[oklch(0.98_0.02_162)]/85
            to-[oklch(0.96_0.04_182)]/65 dark:from-[oklch(0.15_0.06_162)]/40 dark:to-[oklch(0.12_0.08_182)]/25
            text-[oklch(0.3_0.12_162)] dark:text-[oklch(0.85_0.08_162)] rounded-full text-xs font-medium
            border border-[oklch(0.92_0.03_162)]/60 dark:border-[oklch(0.22_0.06_162)]/40
            shadow-lg backdrop-blur-xl hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {topic}
          </motion.span>
        ))}
      </div>
    </motion.div>
  ) : null;
}

function TooltipLeetcode({ meta }: { meta: TooltipMeta }) {
  return meta.leetcode ? (
    <motion.div
      className="text-sm mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-linear-to-r from-[oklch(0.2_0.02_45)] via-[oklch(0.4_0.15_45)] to-[oklch(0.3_0.05_200)] rounded-full shadow-sm"></div>
        <div className="font-bold bg-linear-to-r from-[oklch(0.2_0.02_45)] via-[oklch(0.4_0.15_45)] to-[oklch(0.3_0.05_200)]
        dark:from-[oklch(0.8_0.02_45)] dark:via-[oklch(0.85_0.12_45)] dark:to-[oklch(0.9_0.03_200)]
        bg-clip-text text-transparent text-xs uppercase tracking-wider">
          LeetCode
        </div>
      </div>
      <motion.div
        className="p-5 bg-linear-to-r from-[oklch(0.99_0.01_200)]/85 to-[oklch(0.97_0.02_220)]/65
        dark:from-[oklch(0.12_0.02_200)]/40 dark:to-[oklch(0.08_0.03_220)]/25
        border border-[oklch(0.92_0.02_200)]/60 dark:border-[oklch(0.2_0.04_200)]/40
        rounded-2xl shadow-xl backdrop-blur-2xl hover:shadow-2xl transition-all duration-300"
        whileHover={{ y: -2 }}
      >
        <MarkdownRenderer className="text-[oklch(0.25_0.03_200)] dark:text-[oklch(0.85_0.02_200)] leading-relaxed">
          {meta.leetcode}
        </MarkdownRenderer>
      </motion.div>
    </motion.div>
  ) : null;
}

// Remove TooltipCode since it's not in the new structure

/**
 * Generates structured tooltip content for code symbols based on metadata lookup.
 * 
 * This server-side function searches through symbol metadata using qualified names (qnames)
 * to find documentation for functions, methods, classes, parameters, variables, and expressions.
 * 
 * @param qname - The qualified name to look up (e.g., "koko_eating_bananas:koko_eating_bananas.h")
 * @param TOOLTIP_CONTENT - Dictionary containing all symbol metadata indexed by qname
 * 
 * @returns React node containing structured tooltip content with appropriate sections
 * 
 * @example
 * ```tsx
 * const tooltip = renderTooltipContent(
 *   "koko_eating_bananas:koko_eating_bananas.h", 
 *   metadata
 * );
 * ```
 * 
 * Symbol type handling based on 'kind':
 * - **function/method/class**: Full documentation with parameters, return types, complexity, etc.
 * - **parameter**: Type and description with emerald styling
 * - **variable**: Name and description with purple styling  
 * - **expression**: Expression and description with cyan styling
 */
export function renderTooltipContent(
  qname: string,
  TOOLTIP_CONTENT: Record<string, SymbolMetadata>
): React.ReactNode {

  const meta = TOOLTIP_CONTENT[qname];

  // Fallback: show qname with helpful debug info
  if (!meta) {
    const availableKeys = Object.keys(TOOLTIP_CONTENT)
      .filter(key => key.includes(qname.split(':')[0]) || key.includes(qname.split('.').pop() || ''))
      .slice(0, 3); // Show first 3 matches for debugging

    return (
      <motion.div
        className="p-6 bg-linear-to-r from-[oklch(0.98_0.02_15)]/85 to-[oklch(0.96_0.04_345)]/65
        dark:from-[oklch(0.15_0.06_15)]/40 dark:to-[oklch(0.12_0.08_345)]/25
        border border-[oklch(0.92_0.03_15)]/60 dark:border-[oklch(0.22_0.06_15)]/40
        rounded-2xl shadow-xl backdrop-blur-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-[oklch(0.3_0.12_15)] dark:text-[oklch(0.85_0.08_15)] font-medium">
          Symbol <span className="font-mono bg-[oklch(0.96_0.03_15)]/80 dark:bg-[oklch(0.18_0.08_15)]/60
          px-3 py-1 rounded-lg">{qname}</span> not found.
        </div>
        {availableKeys.length > 0 && (
          <div className="text-xs mt-4 text-[oklch(0.35_0.1_15)] dark:text-[oklch(0.8_0.06_15)] font-medium">
            <div className="mb-2 font-semibold">Similar symbols:</div>
            <div className="flex flex-wrap gap-2">
              {availableKeys.map((key) => (
                <span key={key} className="font-mono bg-[oklch(0.96_0.03_15)]/60 dark:bg-[oklch(0.18_0.08_15)]/40
                px-2 py-1 rounded-lg text-[oklch(0.3_0.1_15)] dark:text-[oklch(0.85_0.06_15)]">
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Create closures with metadata access
  const TooltipParameters = createTooltipParameters(TOOLTIP_CONTENT);
  const TooltipVariables = createTooltipVariables(TOOLTIP_CONTENT);

  // Handle different symbol kinds
  return (
    <motion.div
      className="min-w-[320px] max-w-[480px] bg-linear-to-br from-white/98 via-white/95 to-white/92
      dark:from-[oklch(0.08_0.01_200)]/98 dark:via-[oklch(0.06_0.02_220)]/95 dark:to-[oklch(0.04_0.03_240)]/92
      backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10
      p-8 @container hover:shadow-3xl transition-all duration-500
      ring-1 ring-black/5 dark:ring-white/5"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08
      }}
      whileHover={{ y: -4 }}
      style={{
        background: `linear-gradient(135deg,
          oklch(0.99 0.01 220) 0%,
          oklch(0.98 0.02 200) 25%,
          oklch(0.97 0.03 180) 50%,
          oklch(0.96 0.02 160) 75%,
          oklch(0.98 0.01 140) 100%)
        `,
        ...(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches && {
          background: `linear-gradient(135deg,
            oklch(0.08 0.01 200) 0%,
            oklch(0.06 0.02 220) 25%,
            oklch(0.04 0.03 240) 50%,
            oklch(0.05 0.02 260) 75%,
            oklch(0.07 0.01 280) 100%)
          `
        })
      }}
    >
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipHeader meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipDescription meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipParameters meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipReturns meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipVariables meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipTimeComplexity meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipTopics meta={meta} />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <TooltipLeetcode meta={meta} />
      </motion.div>
    </motion.div>
  );
} 
"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { Block } from "@blocknote/core";
import styled from "@emotion/styled";
import { theme } from "@/styles/theme";

const Wrap = styled.div<{ $editable: boolean }>`
  .bn-editor {
    background: transparent;
    color: ${theme.colors.text};
    font-family: ${theme.font.body};
  }

  .bn-container {
    background: transparent;
    border: none;
  }

  /* dark overrides */
  --bn-colors-editor-background: transparent;
  --bn-colors-editor-text: ${theme.colors.text};
  --bn-colors-menu-background: ${theme.colors.surface};
  --bn-colors-menu-text: ${theme.colors.text};
  --bn-colors-tooltip-background: ${theme.colors.surfaceAlt};
  --bn-colors-tooltip-text: ${theme.colors.text};
  --bn-colors-hovered-background: ${theme.colors.surfaceAlt};
  --bn-colors-selected-background: ${theme.colors.accentSoft};
  --bn-colors-disabled-background: ${theme.colors.surfaceAlt};
  --bn-colors-disabled-text: ${theme.colors.textMuted};
  --bn-colors-side-menu: ${theme.colors.textMuted};
  --bn-colors-highlights-gray-background: rgba(255,255,255,0.06);
  --bn-colors-highlights-gray-text: ${theme.colors.textSub};

  ${({ $editable }) => !$editable && `
    .bn-side-menu, .bn-formatting-toolbar, .bn-slash-menu {
      display: none !important;
    }
  `}
`;

interface EditorProps {
    initialContent?: Block[];
    onChange?: (blocks: Block[]) => void;
    editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
    const editor = useCreateBlockNote({
        initialContent: initialContent && initialContent.length > 0 ? initialContent : undefined,
    });

    return (
        <Wrap $editable={editable}>
            <BlockNoteView
                editor={editor}
                editable={editable}
                theme="dark"
                onChange={() => {
                    if (onChange) {
                        onChange(editor.document as Block[]);
                    }
                }}
            />
        </Wrap>
    );
}

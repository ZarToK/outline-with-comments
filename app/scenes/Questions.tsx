import { observer } from "mobx-react";
import { QuestionMarkIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Discussions from "~/components/Discussions";
import Heading from "~/components/Heading";
import LanguagePrompt from "~/components/LanguagePrompt";
import Scene from "~/components/Scene";
import useStores from "~/hooks/useStores";

function Questions() {
  const { ui } = useStores();
  const { t } = useTranslation();

  return (
    <Scene
      icon={<QuestionMarkIcon color="currentColor" />}
      title={t("Questions")}
    >
      {!ui.languagePromptDismissed && <LanguagePrompt />}
      <Heading>{t("Questions")}</Heading>
      <Discussions></Discussions>
    </Scene>
  );
}

export default observer(Questions);

import React from "react";

import WizardRuleList from "./WizardRuleList";

const WizardRulePanels = props => {
  const { rules } = props;
  const panelIds = rules.reduce((acc, rule) => {
    if (!acc.includes(rule.calculationPanelId)) {
      acc.push(rule.calculationPanelId);
    }
    return acc;
  }, []);
  // Group rules into an array where each element is an array of
  // rules for a particular panel
  const panelsRules = panelIds.map(panelId => {
    return rules.filter(rule => rule.calculationPanelId === panelId);
  });
  return (
    <React.Fragment>
      {panelsRules && panelsRules.length > 0
        ? panelsRules.map(rules => (
            <div
              key={rules[0].calculationPanelId}
              style={{
                margin: "0.5em"
              }}
            >
              <h4>{rules[0].panelName}</h4>{" "}
              <WizardRuleList
                key={rules[0].calculationPanelId}
                rules={rules}
                onInputChange={props.onInputChange}
              />
            </div>
          ))
        : null}
    </React.Fragment>
  );
};

export default WizardRulePanels;

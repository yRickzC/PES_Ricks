# Memória do projeto

Esta pasta preserva o estado conhecido, decisões, mudanças e problemas do RICK — Experimental Systems Lab para reduzir regressões entre sessões de trabalho.

## Antes de alterar o projeto

1. Leia [PROJECT_STATE.md](PROJECT_STATE.md) e [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
2. Consulte [CHANGELOG.md](CHANGELOG.md) para entender por que as decisões atuais foram tomadas.
3. Use [docs/SYSTEM_DESIGN.md](../docs/SYSTEM_DESIGN.md) como fonte canônica da identidade e das regras visuais.
4. Confirme no código e na configuração qualquer estado que possa ter mudado desde a última atualização desta memória.

## Como manter

- Acrescente mudanças concluídas ao CHANGELOG.md em ordem cronológica; não reescreva o histórico.
- Registre bugs com sintoma, reprodução, causa raiz, correção, proteção contra regressão e validação. Use [INCIDENT_TEMPLATE.md](INCIDENT_TEMPLATE.md).
- Mantenha KNOWN_ISSUES.md apenas com questões abertas ou estados que ainda precisam de confirmação. Ao resolver algo, mova o registro para o changelog com a evidência da resolução.
- Não declare testes, builds ou deploys como aprovados sem resultado observado.
- Atualize PROJECT_STATE.md quando versões, arquitetura ou comandos principais mudarem.
- YT_RAW.md continua sendo o diário breve na raiz; esta pasta guarda contexto mais detalhado e duradouro.
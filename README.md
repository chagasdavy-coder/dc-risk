# Gestão de Risco — Opções Binárias

Aplicativo de gerenciamento de risco e evolução de entradas para operações de opções binárias.
**Não se conecta a nenhuma corretora** — é apenas uma ferramenta de cálculo e registro.

⚠️ Opções binárias envolvem alto risco de perda de capital. Esta ferramenta ajuda a organizar
uma disciplina de stake e stop/take, mas não elimina o risco nem garante resultado.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Como funciona

1. **Defina a banca** e clique em "Salvar" — isso trava o valor usado nos cálculos de gestão.
2. **Escolha o nível de risco**:
   - Conservador → gestão = banca ÷ 20
   - Médio → gestão = banca ÷ 10
   - Alto → gestão = banca ÷ 5
   A gestão é dividida em duas entradas iguais (Entrada 1 e Entrada 2).
3. **Registre Win/Loss** em cada entrada. Uma vitória na Entrada 1 libera a Entrada 3
   (valor + lucro); o mesmo vale para Entrada 2 → Entrada 4. Uma derrota encerra aquele ramo.
4. **Take/Stop do dia** seguem proporção 2:1 sobre a gestão (take = +2×gestão, stop = -1×gestão).
   Ao atingir qualquer um, novas operações são bloqueadas e um aviso é exibido.
5. **Gráfico** mostra a evolução da banca a cada entrada, com linhas de referência de take e stop.
6. **Encerrar dia** salva o resultado no histórico (local, via `localStorage`) e soma o resultado
   líquido à banca para o próximo dia.
7. Abas **Estatísticas** e **Histórico** mostram o desempenho acumulado.

## Estrutura

```
app/                 páginas (App Router do Next.js)
components/          BankCard, RiskSelector, OperationTable, ResultButtons,
                      PerformanceChart, StatisticsCards, HistoryTable, DailyResultPanel
hooks/useRiskManagement.ts   toda a lógica matemática de gestão, stop/take e estatísticas
lib/types.ts         tipos e constantes (divisores de risco, etc.)
lib/storage.ts       persistência em localStorage (histórico e configurações)
```

## Personalizar o payout

Clique no ícone de engrenagem no topo para ajustar o payout padrão (90% por padrão).

# Relatório Financeiro Mensal

Gera relatórios de despesas mensais no formato PDF a partir de faturas do cartão Bradesco (app Bradesco Cartões), com categorização automática, imagens de notas fiscais e concatenação de comprovantes de Uber.

---

## Visão Geral

Este projeto automatiza a criação do relatório mensal de despesas corporativas. O fluxo completo é:

1. O usuário exporta a fatura do cartão do app Bradesco Cartões como `.xlsx`
2. Salva o arquivo na pasta do mês correspondente (`OneDrive/Documentos/Trabalho/Despesas/AA-MM-Mes/`)
3. Coloca fotos das notas fiscais na subpasta `NF/` e comprovantes de Uber em `Uber/`
4. Executa o notebook `Relatorio_OC.ipynb`
5. O notebook processa, categoriza, gera um Excel intermediário e produz um PDF final

---

## Estrutura de Diretórios Esperada

```
OneDrive/Documentos/Trabalho/Despesas/
├── 25-01-Janeiro/
│   ├── Fatura_Janeiro.xlsx          # Fatura exportada do app
│   ├── Fatura_Fevereiro.xlsx        # (faturas podem vir no mês seguinte)
│   ├── NF/                          # Fotos das notas fiscais
│   │   ├── nota1.jpg
│   │   └── nota2.jpg
│   ├── Uber/                        # Comprovantes de Uber em PDF
│   │   ├── viagem1.pdf
│   │   └── viagem2.pdf
│   └── df_concatenado_categorias_25-01-Jan.xlsx  # (gerado pelo notebook)
├── 25-02-Fevereiro/                 # Pasta e subpastas para mês seguinte criadas pelo notebook
│   └── NF/
│   └── Uber/
│   └── Fatura_Fevereiro.xlsx
└── Internacional/                   # Despesas internacionais
    └── 25-01-Jan/
        └── NF/
        └── Uber/
        └── Fatura_Janeiro.xlsx
```

---

## Dependências

O notebook instala e utiliza:

| Pacote       | Finalidade                              |
|--------------|----------------------------------------|
| pandas       | Manipulação e análise dos dados da fatura |
| openpyxl     | Leitura/escrita de arquivos Excel       |
| weasyprint   | Geração de PDF a partir de HTML+CSS     |
| pillow       | Otimização de imagens (NFs)             |
| jinja2       | Template engine para o HTML do relatório |
| ipywidgets   | Widgets interativos de seleção (mês/ano)|
| pypdf        | Concatenação de PDFs (relatório + Uber) |
| pytz         | Fuso horário (America/Sao_Paulo)        |

---

## Explicação Detalhada das Células do Notebook

### Célula 1 — Instalação de dependências

Executa `pip install` para todos os pacotes necessários. Deve ser executada apenas na primeira vez.

### Célula 2 — Importações

Carrega todas as bibliotecas usadas no notebook.

### Célula 3 — Widgets interativos

Exibe três controles para o usuário escolher:
- **Tipo**: Nacional (RD) ou Internacional
- **Mês**: dropdown de Janeiro a Dezembro
- **Ano**: campo numérico (2020 até ano atual + 1)

Se os widgets não funcionarem (ambiente sem suporte a ipywidgets), o notebook informa e o usuário deve definir manualmente `TIPO`, `MES` e `ANO` na célula seguinte.

### Célula 4 — Configuração e processamento principal

#### Constantes e estruturas

- **`CATEGORIAS`**: dicionário que mapeia categorias a listas de palavras-chave usadas para classificar automaticamente cada lançamento. Exemplos:
  - `"Uber"` → palavras contendo "uber"
  - `"Refeição"` → "giraffas", "outback", "restaurante", etc.
  - `"Posto"` → "posto", "shell", "ipiranga"
  - `"Cartão"` → "ANUIDADE"
- **`EXPECTED_COLUMNS`**: colunas obrigatórias que o arquivo de fatura deve conter
- **`BASE_DIR`**: diretório raiz onde as pastas mensais estão organizadas

#### Função `load_category_memory` / `save_category_memory`

Gerencia o arquivo `historico_categorias.json`, que armazena o aprendizado de categorizações feitas manualmente pelo usuário. Quando um lançamento já foi categorizado antes, o sistema reusa a categoria salva, evitando ter que reclassificar manualmente todo mês.

#### Dataclass `Transacao`

Estrutura simples que representa uma transação com:
- `Data`, `Lançamento`, `Valor`, `Categoria`, `Observações`

#### Função `get_latest_invoice_file`

Procura na pasta do mês o arquivo de fatura mais recente que corresponde ao padrão `Fatura_{mes}*.xlsx`. Retorna o caminho do arquivo ou `None`.

#### Função `find_header_row`

Lê o arquivo Excel bruto (sem cabeçalho) e procura a linha que contém todos os nomes de coluna esperados (`EXPECTED_COLUMNS`). Isso é necessário porque o app do Bradesco pode gerar o arquivo com linhas de cabeçalho em posições diferentes.

#### Função `categorize`

Classifica um lançamento em uma categoria:
1. Primeiro verifica se o lançamento já está no `memory` (histórico)
2. Depois percorre `CATEGORIAS` testando se alguma palavra-chave está presente na descrição
3. Se não encontrar, retorna `"Categorizar"` — indicando que o usuário deve classificar manualmente

#### Função `processar`

Função principal que orquestra o processamento:

1. **Cálculo de datas**: a `data_analise` aponta para o primeiro dia do mês seguinte ao selecionado. O período de busca cobre ~28 dias para trás, garantindo capturar a fatura correta.
2. **Criação de pastas**: se a pasta do mês não existir, cria automaticamente com subpastas `NF/` e `Uber/`.
3. **Leitura das faturas**: tenta carregar o mês selecionado e o mês seguinte (já que algumas faturas fecham com dias no mês posterior). Para cada arquivo:
   - Localiza o cabeçalho com `find_header_row`
   - Filtra por despesas nacionais ou internacionais conforme o tipo
   - Filtra transações apenas do mês alvo
   - Aplica categorização automática via `categorize`
   - Converte a coluna de data para datetime
4. **Geração do Excel**: salva `df_concatenado_categorias_*.xlsx` com formatação:
   - Tabela com estilo `TableStyleMedium9` (listras alternadas)
   - Coluna "Data" no formato `DD/MM/YYYY`
   - Coluna "Valor" no formato moeda `R$ #,##0.00`
   - Largura das colunas ajustada automaticamente ao conteúdo
5. **Retorno**: devolve as datas processadas e o caminho da pasta do mês

Após a execução, o notebook exibe uma mensagem para o usuário **corrigir manualmente a classificação** na planilha Excel gerada, antes de prosseguir.

### Célula 5 — Correção manual + Geração do relatório

#### Otimização de imagens (`optimize_image`)

Converte imagens de notas fiscais para escala de cinza, redimensiona para no máximo 800px de largura e salva como JPEG com qualidade 50%, reduzindo significativamente o tamanho do PDF final.

#### Leitura da planilha corrigida

Carrega o arquivo Excel que o usuário editou manualmente e atualiza o `memory` com as novas categorizações, salvando em `historico_categorias.json` para uso futuro.

#### Limpeza dos dados (`clean_data`)

- Converte `Valor` para float32
- Formata valores como moeda (R$ para nacional, US$ para internacional)
- Formata datas como `DD/MM/YYYY`

#### Geração de lista de legendas (`imagens`)

Cria uma legenda para cada imagem de NF no formato: `"{Lançamento} {Valor} {Data}"`. Exclui categorias "Uber", "Cartão" e "Assinatura Uber" (que não têm NF).

#### Resumo por categoria (`summarize_data`)

Agrupa as transações por categoria, calculando:
- Soma dos valores
- Quantidade de lançamentos
- Média por lançamento

#### Função `generate_pdf`

1. Carrega o template Jinja2 (`template.html`)
2. Renderiza o HTML com os dados do contexto
3. Salva um HTML temporário
4. Converte para PDF usando WeasyPrint com o CSS (`styles.css`)
5. Remove o HTML temporário

O contexto passado ao template inclui:
- `hoje`: data/hora atual no formato ISO
- `data`: lista de linhas da tabela de detalhes
- `data_a`: lista de linhas da tabela de resumo
- `columns`, `columns_a`: nomes das colunas das tabelas
- `images`: caminhos das imagens otimizadas
- `images_names`: legendas descritivas das imagens
- `total`: valor total formatado
- `datas`: nome do mês/ano do relatório

### Célula 6 — Concatenação com PDFs de Uber

Usa `pypdf` (PdfReader/PdfWriter) para:
1. **Abrir o relatório principal** gerado na célula anterior
2. **Adicionar todos os PDFs** encontrados na pasta `Uber/` (ordenados por nome)
3. **Salvar o PDF final** com nome `"Relatório de Transações e Uber de {Mês Ano}.pdf"`

Exibe o nome do arquivo final e o tamanho em MB.

---

## Fluxo de Uso Passo a Passo

1. **Exporte a fatura** do aplicativo Bradesco Cartões como arquivo Excel
2. **Salve em** `OneDrive/Documentos/Trabalho/Despesas/AA-MM-Mes/Fatura_Mes.xlsx`
3. **Coloque fotos das NFs** em `.../NF/` (formatos .png, .jpg, .jpeg)
4. **Coloque comprovantes de Uber** em `.../Uber/` (formato .pdf)
5. **Abra** `Relatorio_OC.ipynb` no Jupyter
6. **Execute a célula 1** (apenas na primeira vez ou se faltar dependências)
7. **Execute a célula 3** — selecione o tipo (Nacional/Internacional), mês e ano
8. **Execute a célula 4** — processamento principal é executado
9. **Abra a planilha Excel** gerada e corrija manualmente a categoria de itens marcados como "Categorizar"
10. **Execute a célula 5** — gera o PDF com tabelas e imagens das NFs
11. **Execute a célula 6** — concatena os PDFs de Uber ao relatório

---

## Arquivos de Suporte

### `template.html`

Template Jinja2 que define a estrutura visual do PDF:

- **Cabeçalho**: nome do funcionário, mês de referência, período
- **Tabela de validação**: espaço para assinaturas do empregado, gerente e contabilidade
- **Tabela de detalhes**: todas as transações com Data, Lançamento, Valor, Categoria, Observações
- **Linha de total**: soma de todos os valores no final da tabela
- **Resumo por categoria**: agrupamento com soma, quantidade e média
- **Grid de imagens**: fotos das notas fiscais organizadas em 2x2 por página, com legendas

### `styles.css`

Folha de estilo para formatação do PDF via WeasyPrint:

- Página A4 com margens definidas via `@page`
- Fontes Arial, cores alternadas nas linhas das tabelas
- Grid CSS 2x2 para imagens ocupando altura total da página
- Quebras de página entre seções
- Bordas e espaçamentos consistentes

### `historico_categorias.json`

Arquivo gerado automaticamente que armazena o mapeamento entre descrições de lançamentos e suas categorias. Permite que o sistema aprenda com correções manuais ao longo do tempo, reduzindo o trabalho de reclassificação a cada mês.

---

## Resultados Esperados

Ao final da execução, os seguintes arquivos são gerados na pasta do mês:

| Arquivo | Descrição |
|---------|-----------|
| `df_concatenado_categorias_AA-MM-Mes.xlsx` | Planilha com transações categorizadas (formato tabela) |
| `Relatório de Transações de Mês Ano.pdf` | Relatório principal com tabelas e imagens das NFs |
| `Relatório de Transações e Uber de Mês Ano.pdf` | Relatório final completo, com comprovantes de Uber anexados |

### Exemplo de saída esperada:

```
===================================
PDF final criado com sucesso!
Arquivo: Relatório de Transações e Uber de Janeiro 2025.pdf
Tamanho: 4.52 MB
===================================
```

---

## Observações

- A classificação automática depende das palavras-chave definidas em `CATEGORIAS`. Novos padrões podem ser adicionados conforme necessário.
- As imagens são otimizadas (escala de cinza, redimensionamento, compressão JPEG) para manter o PDF em tamanho razoável.
- O sistema suporta dois modos: **Nacional** (RD, moeda R$) e **Internacional** (moeda US$, com colunas adicionais de cotação).
- A base de categorias aprendidas (`historico_categorias.json`) fica no mesmo diretório do notebook e é acumulativa entre execuções.

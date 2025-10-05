### Entidades e Atributos

Aqui está a lista de todas as entidades identificadas e seus atributos. O atributo que funciona como chave primária (PK) está marcado.

**Entidade: User**

  * `use_uuid` (PK)
  * `use_email`
  * `use_email_verified`
  * `use_username`
  * `use_password`
  * `use_role`
  * `use_avatar`
  * `created_at`
  * `updated_at`

**Entidade: Specialty**

  * `spe_id` (PK)
  * `spe_name`

**Entidade: Insurance**

  * `ins_id` (PK)
  * `ins_name`

**Entidade: Modality**

  * `mod_id` (PK)
  * `mod_name`

**Entidade: CardInsurance**

  * `cti_id` (PK)
  * `cti_validate`
  * `cti_card_number`
  * `fk_cti_ins_id` (FK)

**Entidade: Country**

  * `cou_id` (PK)
  * `cou_name`

**Entidade: State**

  * `sta_id` (PK)
  * `sta_name`
  * `sta_uf`
  * `fk_sta_cou_id` (FK)

**Entidade: City**

  * `cty_id` (PK)
  * `cty_name`
  * `fk_cty_sta_id` (FK)

**Entidade: Address**

  * `add_id` (PK)
  * `add_name`
  * `add_number`
  * `add_neighborhood`
  * `add_street`
  * `add_cep`
  * `fk_add_cty_id` (FK)

**Entidade: Log**
  * `log_id`
  * `log_table_name`
  * `log_row_id`
  * `log_action`
  * `log_description`
  * `log_dateAction`
  * `fk_log_use_id`
  * `created_at`
  * `updated_at`

**Entidade Associativa: Insurance\_to\_specialty**

  * `fk_isp_ins_id` (PK, FK)
  * `fk_isp_spe_id` (PK, FK)
  * `isp_price`
  * `isp_amount_transferred`

**Entidade Associativa: modalities\_to\_insurance**

  * `fk_inm_mod_id` (PK, FK)
  * `fk_inm_ins_id` (PK, FK)

-----

### Relacionamentos e Cardinalidades

A seguir, são descritos os relacionamentos entre as entidades, incluindo o tipo e a cardinalidade de cada um.

1.  **Country e State**

      * **Tipo:** Um para Muitos (1:N)
      * **Descrição:** Um `Country` pode ter vários `State`s, mas cada `State` pertence a um único `Country`.
      * **Cardinalidade:** `Country` (1,1) -- (1,N) `State`

2.  **State e City**

      * **Tipo:** Um para Muitos (1:N)
      * **Descrição:** Um `State` pode ter várias `City`s, mas cada `City` pertence a um único `State`.
      * **Cardinalidade:** `State` (1,1) -- (1,N) `City`

3.  **City e Address**

      * **Tipo:** Um para Muitos (1:N)
      * **Descrição:** Uma `City` pode ter vários `Address`es, mas cada `Address` está localizado em uma única `City`.
      * **Cardinalidade:** `City` (1,1) -- (1,N) `Address`

4.  **Insurance e CardInsurance**

      * **Tipo:** Um para Muitos (1:N)
      * **Descrição:** Um convênio (`Insurance`) pode estar associado a vários cartões (`CardInsurance`), mas cada cartão pertence a um único convênio.
      * **Cardinalidade:** `Insurance` (1,1) -- (0,N) `CardInsurance`

5.  **Insurance e Specialty**

      * **Tipo:** Muitos para Muitos (N:M)
      * **Entidade Associativa:** `Insurance_to_specialty`
      * **Descrição:** Um convênio (`Insurance`) pode cobrir várias especialidades (`Specialty`), e uma especialidade pode ser atendida por múltiplos convênios. A tabela associativa `Insurance_to_specialty` armazena o preço (`isp_price`) e o valor de repasse (`isp_amount_transferred`) para cada combinação.

6.  **Insurance e Modality**

      * **Tipo:** Muitos para Muitos (N:M)
      * **Entidade Associativa:** `modalities_to_insurance`
      * **Descrição:** Um convênio (`Insurance`) pode oferecer suporte a várias modalidades de atendimento (`Modality`), como telemedicina ou presencial, e uma modalidade pode ser aceita por diferentes convênios.
      

7. **Log e Usuário**
    * **Tipo:** Um pra muitos (1:N)
    * **Descrição:** Um usuário pode realizar diversas ações no sistema, portanto, pode haver diversos logs de alteração.
    * **Cardinalidade:** `Log` (N,1) -- (N,1) `Usuário`


**Observação Importante:**
De acordo com o arquivo JSON fornecido, a entidade `User` não possui relacionamentos explícitos com nenhuma outra entidade da base de dados, como `Address` ou `CardInsurance`. Em um sistema real, seria esperado que essas conexões existissem.

-----

### Diagrama MER (Representação Visual)

```mermaid
erDiagram
    User {
        VARCHAR use_uuid PK
        VARCHAR use_email
        BOOLEAN use_email_verified
        VARCHAR use_username
        VARCHAR use_password
        VARCHAR use_role
        VARCHAR use_avatar
        DATE created_at
        DATE updated_at
    }

    Specialty {
        VARCHAR spe_id PK
        VARCHAR spe_name
    }

    Insurance {
        VARCHAR ins_id PK
        VARCHAR ins_name
    }

    Modality {
        VARCHAR mod_id PK
        VARCHAR mod_name
    }

    CardInsurance {
        VARCHAR cti_id PK
        DATE cti_validate
        VARCHAR cti_card_number
        VARCHAR fk_cti_ins_id FK
    }

    Country {
        VARCHAR cou_id PK
        VARCHAR cou_name
    }

    State {
        VARCHAR sta_id PK
        VARCHAR sta_name
        VARCHAR sta_uf
        VARCHAR fk_sta_cou_id FK
    }

    City {
        VARCHAR cty_id PK
        VARCHAR cty_name
        VARCHAR fk_cty_sta_id FK
    }

    Address {
        VARCHAR add_id PK
        VARCHAR add_name
        VARCHAR add_number
        VARCHAR add_neighborhood
        VARCHAR add_street
        VARCHAR add_cep
        VARCHAR fk_add_cty_id FK
    }

    Insurance_to_specialty {
        VARCHAR fk_isp_ins_id PK, FK
        VARCHAR fk_isp_spe_id PK, FK
        FLOAT isp_price
        FLOAT isp_amount_transferred
    }

    modalities_to_insurance {
        VARCHAR fk_inm_mod_id PK, FK
        VARCHAR fk_inm_ins_id PK, FK
    }
    Log {
      VARCHAR  log_id
      VARCHAR  log_table_name
      VARCHAR  log_row_id
      VARCHAR  log_action
      VARCHAR  log_description
      DATE  log_dateAction
      VARCHAR  fk_log_use_id
      DATE  created_at
      DATE  updated_at
    }

    Country ||--o{ State : contains
    State ||--o{ City : contains
    City ||--o{ Address : contains
    Insurance ||--o{ CardInsurance : has
    Insurance }o--o{ Insurance_to_specialty : covers
    Specialty }o--o{ Insurance_to_specialty : is_covered_by
    Insurance }o--o{ modalities_to_insurance : supports
    Modality }o--o{ modalities_to_insurance : is_supported_by

```
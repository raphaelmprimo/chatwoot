class Kanban::AttributesVisiblesService
  pattr_initialize [:account_id!, :kanban_id!, :attributes_visibles, :action!]

  def perform
    case action.to_sym
    when :create
      create_attributes_visibles
    when :update
      update_attributes_visibles
    end
  end

  private

  def create_attributes_visibles
    kanban.attributes_visibles =
      [{ id: SecureRandom.uuid, name: 'agent_last_seen_at', description: 'Data que o agente viu pela última vez', visible: false },
       { id: SecureRandom.uuid, name: 'assignee_last_seen_at', description: 'Data que o responsável viu pela última', visible: false },
       { id: SecureRandom.uuid, name: 'contact_last_seen_at', description: 'Data que o contato viu pela última vez', visible: false },
       { id: SecureRandom.uuid, name: 'custom_attributes', description: 'Campos personalizados', visible: false },
       { id: SecureRandom.uuid, name: 'muted', description: 'Se a Conversa está Mutada', visible: false },
       { id: SecureRandom.uuid, name: 'snoozed_until', description: 'Data do adiamento da conversa', visible: false },
       { id: SecureRandom.uuid, name: 'status', description: 'Status', visible: false },
       { id: SecureRandom.uuid, name: 'created_at', description: 'Data da criação', visible: false },
       { id: SecureRandom.uuid, name: 'timestamp', description: 'Data da última atividade', visible: false },
       { id: SecureRandom.uuid, name: 'first_reply_created_at', description: 'Data da primeira resposta', visible: false },
       { id: SecureRandom.uuid, name: 'last_activity_at', description: 'Data da ultima atividade', visible: false },
       { id: SecureRandom.uuid, name: 'priority', description: 'Prioridade', visible: false },
       { id: SecureRandom.uuid, name: 'waiting_since', description: 'Tempo de espera', visible: false }]
    kanban.save
  end

  def update_attributes_visibles
    # Itera sobre os atributos recebidos
    attributes_visibles.each do |updated_attr|
      puts "---------------------------------------update_attr: #{updated_attr}--------------------------------------------"

      # Encontra o atributo correspondente pelo ID
      existing_attr = kanban.attributes_visibles.find { |attr| attr['id'] == updated_attr['id'] }

      next unless existing_attr

      # Atualiza os campos do card
      existing_attr[:name] = updated_attr[:name] if updated_attr.key?(:name)
      existing_attr[:description] = updated_attr[:description] if updated_attr.key?(:description)
      existing_attr[:visible] = updated_attr[:visible] if updated_attr.key?(:visible)
    end

    kanban.save
  end

  def kanban
    @kanban ||= Kanban.find(kanban_id)
  end

  def account
    @account ||= Account.find(account_id)
  end
end

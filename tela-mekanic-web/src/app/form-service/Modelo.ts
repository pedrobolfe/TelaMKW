export interface Carro {
    id: string;
    placa: string;
    marca: string;
    modelo: string;
    chassi: string;
    cilindrada: string;
    Ano_anoModelo: string;
    ordemServico: OrdemServico[];
}

export interface OrdemServico {
    numero: string;
    pecas: Peca[];
    servicos: Servico[];
}

export interface Peca {
    codigo_peca: string;
    descricao: string;
}

export interface Servico {
    codigo_servico: string;
    descricao: string;
    tempo_duracao: number;
}
const sql = require('mssql'); // Importa o mssql
const db = require('../models/db'); // Garanta que este caminho está correto para seu arquivo de conexão com o DB

// Função para processar o pagamento
exports.processPayment = async (req, res) => {
    // ⚠️ Importante: Em um sistema real, o OrderID NÃO viria diretamente do frontend
    // Ele seria gerado no backend ao criar o pedido ou recuperado de uma sessão/token seguro.
    // Estamos usando req.body.orderId APENAS para demonstração e para vincular o pagamento a um pedido existente.
    const { paymentMethod, amount, orderId, transactionDetails } = req.body;
    const userId = req.user.id; // Assumindo que o ID do usuário está no token JWT (req.user)

     console.log('--- Dados da Requisição de Pagamento ---');
    console.log('paymentMethod:', paymentMethod);
    console.log('amount:', amount);
    console.log('orderId:', orderId);
    console.log('transactionDetails:', transactionDetails);
    if (transactionDetails) {
        console.log('transactionDetails.id:', transactionDetails.id);
        console.log('transactionDetails.pixCode:', transactionDetails.pixCode);
        // Adicione mais logs para outros campos de transactionDetails se houver
    }
    console.log('-------------------------------------');
    if (!orderId || !paymentMethod || !amount) {
        return res.status(400).json({ message: 'Dados de pagamento incompletos.' });
    }

    let transaction; // Variável para armazenar a transação do MSSQL

    try {
        const pool = await db.getPool(); // Obtém a pool de conexão do banco de dados
        transaction = new sql.Transaction(pool); // Inicia uma nova transação
        await transaction.begin(); // Começa a transação

        const request = new sql.Request(transaction);

        // 1. Inserir o registro de pagamento na tabela dbo.Payments
        // Note que Amount e OrderID vêm do body, mas em um cenário real o Amount seria
        // calculado com base nos itens do pedido já salvos no banco de dados.
        const paymentResult = await request
            .input('orderId', sql.Int, orderId)
            .input('paymentMethod', sql.NVarChar, paymentMethod)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('transactionId', sql.NVarChar, transactionDetails ? transactionDetails.id : null)
            .input('paymentStatus', sql.NVarChar, 'Approved') // ou 'Pending', 'Declined'
            .input('cardLastFourDigits', sql.NVarChar, transactionDetails ? transactionDetails.cardLastFourDigits : null)
            .input('cardBrand', sql.NVarChar, transactionDetails ? transactionDetails.cardBrand : null)
            .input('pixCode', sql.NVarChar, transactionDetails ? transactionDetails.pixCode : null)
            .input('changeAmount', sql.Decimal(10, 2), transactionDetails ? transactionDetails.changeAmount : null)
            .query(`
                INSERT INTO dbo.Payments (
                    OrderID, PaymentMethod, Amount, TransactionID, PaymentStatus,
                    CardLastFourDigits, CardBrand, PixCode, ChangeAmount
                )
                VALUES (
                    @orderId, @paymentMethod, @amount, @transactionId, @paymentStatus,
                    @cardLastFourDigits, @cardBrand, @pixCode, @changeAmount
                );
                SELECT SCOPE_IDENTITY() AS PaymentID; -- Retorna o ID do pagamento recém-inserido
            `);

        const newPaymentId = paymentResult.recordset[0].PaymentID;
        console.log(`Pagamento ID ${newPaymentId} inserido para o pedido ${orderId}.`);

        // 2. Atualizar o status do pedido na tabela dbo.Orders
        // Você pode ter uma coluna como 'PaymentStatus' ou 'OrderStatus' na sua tabela Orders
        // para indicar que o pagamento foi concluído.
        const updateOrderRequest = new sql.Request(transaction);
        await updateOrderRequest
            .input('orderId', sql.Int, orderId)
            .input('paymentStatus', sql.NVarChar, 'Paid') // Define o status do pedido como pago
            .query(`
                UPDATE dbo.Orders
                SET Status = @paymentStatus -- Ou sua coluna de status de pagamento, ex: PaymentStatus = @paymentStatus
                WHERE Id = @orderId;
            `);

        // 3. Confirmar a transação
        await transaction.commit();
        console.log('Transação de pagamento e atualização de pedido concluídas com sucesso.');

        res.status(200).json({
            message: 'Pagamento processado com sucesso!',
            paymentId: newPaymentId,
            orderId: orderId,
            status: 'success'
        });

    } catch (err) {
        // Se algo der errado, faz o rollback da transação para desfazer as operações
        if (transaction) {
            try {
                await transaction.rollback();
                console.error('Transação desfeita devido a um erro:', err);
            } catch (rollbackErr) {
                console.error('Erro ao fazer rollback da transação:', rollbackErr);
            }
        }
        console.error('Erro no processamento do pagamento:', err);
        res.status(500).json({ message: 'Erro ao processar o pagamento.', error: err.message });
    }
};

// ... outras funções do seu paymentController (se houver) ...
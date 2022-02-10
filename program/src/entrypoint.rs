use crate::error::VotingError;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VotingAccount {
    pub option: u64,
    pub signer: Pubkey,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct InstructionData {
    pub option: u64,
    pub bump_seed: u8,
    pub exempt_lamports: u64,
}

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_info_iter = &mut accounts.iter();
    let instruction_data = InstructionData::try_from_slice(&instruction_data)?;
    msg!("{:?}", instruction_data);

    /* if instruction_data.amount < 1000 {
        msg!("Unavailable option");
        return Err(VotingError::UnavailableOption.into());
    } */

    let sender = next_account_info(accounts_info_iter)?;
    let voting_account_info = next_account_info(accounts_info_iter)?;

    if voting_account_info.data.borrow().len() == 0 {
        msg!("Creating associated voting account");
        let create_voting_account_ix = system_instruction::create_account(
            &sender.key,
            &voting_account_info.key,
            instruction_data.exempt_lamports,
            40,
            &program_id,
        );
        invoke_signed(
            &create_voting_account_ix,
            &[sender.clone(), voting_account_info.clone()],
            &[&[
                b"luckyshogun_voting_account",
                &sender.key.to_bytes(),
                &[instruction_data.bump_seed],
            ]],
        )?;
    }

    if !sender.is_signer {
        msg!("Not signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    if voting_account_info.owner != program_id {
        msg!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let rent = Rent::get().unwrap();
    if !rent.is_exempt(voting_account_info.lamports(), voting_account_info.data_len()) {
        msg!("Account not rent-exempt");
        return Err(ProgramError::AccountNotRentExempt);
    }
    
    let voting_account: VotingAccount = VotingAccount {
        option: instruction_data.option,
        signer: sender.key.clone()
    };

    voting_account.serialize(&mut &mut voting_account_info.data.borrow_mut()[..])?;
    msg!("{:?}", voting_account);

    Ok(())
}

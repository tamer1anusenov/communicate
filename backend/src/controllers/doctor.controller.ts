import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor, Specialization } from '../models/Doctor';
import { User, UserRole } from '../models/User';

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctorRepository = AppDataSource.getRepository(Doctor);
    // Add relations to load the user data
    const doctors = await doctorRepository.find({
      relations: ['user']
    });
    
    // Format the response to match frontend expectations
    const formattedDoctors = doctors.map(doctor => {
      // Map doctor specialization to image filename
      let imageName = '';
      
      // This maps each doctor to an image based on their name
      // In a real app, you'd store image paths in the database
      switch(doctor.user.firstName) {
        case 'Алина': imageName = 'alina.png'; break;
        case 'Данияр': imageName = 'daniyar.png'; break;
        case 'Айжан': imageName = 'aizhan.png'; break;
        case 'Тимур': imageName = 'timur.png'; break;
        case 'Гульнара': imageName = 'gulnura.png'; break;
        case 'Марат': imageName = 'marat.png'; break;
        case 'Эльмира': imageName = 'elmira.png'; break;
        case 'Руслан': imageName = 'ruslan.png'; break;
        case 'Жанна': imageName = 'zhanna.png'; break;
        case 'Нурия': imageName = 'nuria.png'; break;
        case 'Гульнар': imageName = 'gulnar.png'; break;
        case 'Сергей': imageName = 'sergey.png'; break;
        case 'Аскар': imageName = 'askar.png'; break;
        case 'Айгуль': imageName = 'aigul.png'; break;
        case 'Мурад': imageName = 'murat.png'; break;
        default: imageName = 'default.png';
      }
      
      return {
        id: doctor.id,
        firstName: doctor.user.firstName,
        lastName: doctor.user.lastName,
        specialization: doctor.specialization.toUpperCase(),
        experience: doctor.experience,
        description: doctor.description,
        // Return a URL to the image
        image: `http://localhost:5000/images/${imageName}`
      };
    });
    
    res.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to get doctors', error });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctorRepository = AppDataSource.getRepository(Doctor);
    const doctor = await doctorRepository.findOne({
      where: { id: req.params.id },
      relations: ['user']
    });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    // Format the response
    const formattedDoctor = {
      id: doctor.id,
      firstName: doctor.user.firstName,
      lastName: doctor.user.lastName,
      specialization: doctor.specialization,
      image: 'https://via.placeholder.com/150'
    };
    
    res.json(formattedDoctor);
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    res.status(500).json({ message: 'Failed to get doctor', error });
  }
};

export const getBySpecialization = async (req: Request, res: Response) => {
  try {
    const doctorRepository = AppDataSource.getRepository(Doctor);
    const doctors = await doctorRepository.find({
      where: { specialization: req.params.specialization.toUpperCase() as Specialization },
      relations: ['user']
    });
    
    // Format the response
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.user.firstName,
      lastName: doctor.user.lastName,
      specialization: doctor.specialization,
      image: 'https://via.placeholder.com/150'
    }));
    
    res.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors by specialization:', error);
    res.status(500).json({ message: 'Failed to get doctors by specialization', error });
  }
};

// Test endpoint to return sample doctor data
export const getTestDoctors = async (req: Request, res: Response) => {
  try {
    // Create sample doctor data that matches the frontend expectations
    const sampleDoctors = [
      // Терапевты
      {
        id: '1',
        firstName: 'Алина',
        lastName: 'Коваль',
        specialization: 'THERAPIST',
        experience: '12 лет',
        description: 'Диагностика и лечение ОРЗ, хронических заболеваний, вакцинация',
        image: 'http://localhost:5000/images/alina.png'
      },
      {
        id: '2',
        firstName: 'Данияр',
        lastName: 'Мухамедов',
        specialization: 'THERAPIST',
        experience: '8 лет',
        description: 'Амбулаторная терапия, профилактика заболеваний, диагностика',
        image: 'http://localhost:5000/images/daniyar.png'
      },
      {
        id: '3',
        firstName: 'Айжан',
        lastName: 'Нурмаганбетова',
        specialization: 'THERAPIST',
        experience: '10 лет',
        description: 'Комплексная терапия, лечение пациентов с гипертонией',
        image: 'http://localhost:5000/images/aizhan.png'
      },
      // Кардиологи
      {
        id: '4',
        firstName: 'Тимур',
        lastName: 'Алиев',
        specialization: 'CARDIOLOGIST',
        experience: '15 лет',
        description: 'Лечение ИБС, ЭКГ, консультации по сердечно-сосудистым заболеваниям',
        image: 'http://localhost:5000/images/timur.png'
      },
      {
        id: '5',
        firstName: 'Гульнара',
        lastName: 'Сулейменова',
        specialization: 'CARDIOLOGIST',
        experience: '11 лет',
        description: 'Кардиоскрининг, эхокардиография, реабилитация после инфаркта',
        image: 'http://localhost:5000/images/gulnura.png'
      },
      {
        id: '6',
        firstName: 'Марат',
        lastName: 'Абдрахманов',
        specialization: 'CARDIOLOGIST',
        experience: '9 лет',
        description: 'Диагностика и лечение аритмии, гипертонии',
        image: 'http://localhost:5000/images/marat.png'
      },
      // Неврологи
      {
        id: '7',
        firstName: 'Эльмира',
        lastName: 'Байжанова',
        specialization: 'NEUROLOGIST',
        experience: '13 лет',
        description: 'Мигрени, бессонница, постинсультное восстановление',
        image: 'http://localhost:5000/images/elmira.png'
      },
      {
        id: '8',
        firstName: 'Руслан',
        lastName: 'Оспанов',
        specialization: 'NEUROLOGIST',
        experience: '10 лет',
        description: 'Радикулит, остеохондроз, невропатия',
        image: 'http://localhost:5000/images/ruslan.png'
      },
      {
        id: '9',
        firstName: 'Жанна',
        lastName: 'Карибаева',
        specialization: 'NEUROLOGIST',
        experience: '7 лет',
        description: 'ЭЭГ диагностика, вестибулярные расстройства',
        image: 'http://localhost:5000/images/zhanna.png'
      },
      // Педиатры
      {
        id: '10',
        firstName: 'Нурия',
        lastName: 'Асельбек',
        specialization: 'PEDIATRICIAN',
        experience: '10 лет',
        description: 'Наблюдение за детьми от 0 до 12 лет, вакцинация, ОРВИ',
        image: 'http://localhost:5000/images/nuria.png'
      },
      {
        id: '11',
        firstName: 'Гульнар',
        lastName: 'Ахметова',
        specialization: 'PEDIATRICIAN',
        experience: '8 лет',
        description: 'Аллергии, диспансеризация, консультации родителей',
        image: 'http://localhost:5000/images/gulnar.png'
      },
      {
        id: '12',
        firstName: 'Сергей',
        lastName: 'Романов',
        specialization: 'PEDIATRICIAN',
        experience: '6 лет',
        description: 'Работа с новорожденными, хронические детские заболевания',
        image: 'http://localhost:5000/images/sergey.png'
      },
      // Хирурги
      {
        id: '13',
        firstName: 'Аскар',
        lastName: 'Нуртаев',
        specialization: 'SURGEON',
        experience: '14 лет',
        description: 'Общая хирургия, лапароскопия',
        image: 'http://localhost:5000/images/askar.png'
      },
      {
        id: '14',
        firstName: 'Айгуль',
        lastName: 'Калиева',
        specialization: 'SURGEON',
        experience: '12 лет',
        description: 'Малые хирургические вмешательства, перевязки',
        image: 'http://localhost:5000/images/aigul.png'
      },
      {
        id: '15',
        firstName: 'Мурад',
        lastName: 'Хамитов',
        specialization: 'SURGEON',
        experience: '9 лет',
        description: 'Послеоперационное сопровождение, амбулаторные операции',
        image: 'http://localhost:5000/images/murat.png'
      }
    ];
    
    res.json(sampleDoctors);
  } catch (error) {
    console.error('Error in test doctors endpoint:', error);
    res.status(500).json({ message: 'Failed to get test doctors', error });
  }
};

// Add sample doctors to the database with specific data
export const addSampleDoctors = async (req: Request, res: Response) => {
  try {
    const doctorRepository = AppDataSource.getRepository(Doctor);
    const userRepository = AppDataSource.getRepository(User);
    
    // Sample doctors data based on the frontend data
    const sampleDoctors = [
      // Терапевты
      {
        user: {
          firstName: 'Алина',
          lastName: 'Коваль',
          email: 'alina.koval@example.com',
          inn: '123456789001',
          phone: '+7 (999) 123-45-01',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.THERAPIST,
        education: 'Медицинский университет',
        experience: '12 лет',
        description: 'Диагностика и лечение ОРЗ, хронических заболеваний, вакцинация'
      },
      {
        user: {
          firstName: 'Данияр',
          lastName: 'Мухамедов',
          email: 'daniyar.mukhamedov@example.com',
          inn: '123456789002',
          phone: '+7 (999) 123-45-02',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.THERAPIST,
        education: 'Медицинский университет',
        experience: '8 лет',
        description: 'Амбулаторная терапия, профилактика заболеваний, диагностика'
      },
      {
        user: {
          firstName: 'Айжан',
          lastName: 'Нурмаганбетова',
          email: 'aizhan.nurmaganbetova@example.com',
          inn: '123456789003',
          phone: '+7 (999) 123-45-03',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.THERAPIST,
        education: 'Медицинский университет',
        experience: '10 лет',
        description: 'Комплексная терапия, лечение пациентов с гипертонией'
      },
      // Кардиологи
      {
        user: {
          firstName: 'Тимур',
          lastName: 'Алиев',
          email: 'timur.aliev@example.com',
          inn: '123456789004',
          phone: '+7 (999) 123-45-04',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.CARDIOLOGIST,
        education: 'Медицинский университет',
        experience: '15 лет',
        description: 'Лечение ИБС, ЭКГ, консультации по сердечно-сосудистым заболеваниям'
      },
      {
        user: {
          firstName: 'Гульнара',
          lastName: 'Сулейменова',
          email: 'gulnara.suleymenova@example.com',
          inn: '123456789005',
          phone: '+7 (999) 123-45-05',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.CARDIOLOGIST,
        education: 'Медицинский университет',
        experience: '11 лет',
        description: 'Кардиоскрининг, эхокардиография, реабилитация после инфаркта'
      },
      {
        user: {
          firstName: 'Марат',
          lastName: 'Абдрахманов',
          email: 'marat.abdrakhmanov@example.com',
          inn: '123456789006',
          phone: '+7 (999) 123-45-06',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.CARDIOLOGIST,
        education: 'Медицинский университет',
        experience: '9 лет',
        description: 'Диагностика и лечение аритмии, гипертонии'
      },
      // Неврологи
      {
        user: {
          firstName: 'Эльмира',
          lastName: 'Байжанова',
          email: 'elmira.bayzhanova@example.com',
          inn: '123456789007',
          phone: '+7 (999) 123-45-07',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.NEUROLOGIST,
        education: 'Медицинский университет',
        experience: '13 лет',
        description: 'Мигрени, бессонница, постинсультное восстановление'
      },
      {
        user: {
          firstName: 'Руслан',
          lastName: 'Оспанов',
          email: 'ruslan.ospanov@example.com',
          inn: '123456789008',
          phone: '+7 (999) 123-45-08',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.NEUROLOGIST,
        education: 'Медицинский университет',
        experience: '10 лет',
        description: 'Радикулит, остеохондроз, невропатия'
      },
      {
        user: {
          firstName: 'Жанна',
          lastName: 'Карибаева',
          email: 'zhanna.karibaeva@example.com',
          inn: '123456789009',
          phone: '+7 (999) 123-45-09',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.NEUROLOGIST,
        education: 'Медицинский университет',
        experience: '7 лет',
        description: 'ЭЭГ диагностика, вестибулярные расстройства'
      },
      // Педиатры
      {
        user: {
          firstName: 'Нурия',
          lastName: 'Асельбек',
          email: 'nuria.aselbek@example.com',
          inn: '123456789010',
          phone: '+7 (999) 123-45-10',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.PEDIATRICIAN,
        education: 'Медицинский университет',
        experience: '10 лет',
        description: 'Наблюдение за детьми от 0 до 12 лет, вакцинация, ОРВИ'
      },
      {
        user: {
          firstName: 'Гульнар',
          lastName: 'Ахметова',
          email: 'gulnar.akhmetova@example.com',
          inn: '123456789011',
          phone: '+7 (999) 123-45-11',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.PEDIATRICIAN,
        education: 'Медицинский университет',
        experience: '8 лет',
        description: 'Аллергии, диспансеризация, консультации родителей'
      },
      {
        user: {
          firstName: 'Сергей',
          lastName: 'Романов',
          email: 'sergey.romanov@example.com',
          inn: '123456789012',
          phone: '+7 (999) 123-45-12',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.PEDIATRICIAN,
        education: 'Медицинский университет',
        experience: '6 лет',
        description: 'Работа с новорожденными, хронические детские заболевания'
      },
      // Хирурги
      {
        user: {
          firstName: 'Аскар',
          lastName: 'Нуртаев',
          email: 'askar.nurtaev@example.com',
          inn: '123456789013',
          phone: '+7 (999) 123-45-13',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.SURGEON,
        education: 'Медицинский университет',
        experience: '14 лет',
        description: 'Общая хирургия, лапароскопия'
      },
      {
        user: {
          firstName: 'Айгуль',
          lastName: 'Калиева',
          email: 'aigul.kalieva@example.com',
          inn: '123456789014',
          phone: '+7 (999) 123-45-14',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.SURGEON,
        education: 'Медицинский университет',
        experience: '12 лет',
        description: 'Малые хирургические вмешательства, перевязки'
      },
      {
        user: {
          firstName: 'Мурад',
          lastName: 'Хамитов',
          email: 'murad.khamitov@example.com',
          inn: '123456789015',
          phone: '+7 (999) 123-45-15',
          password: 'password123',
          role: UserRole.DOCTOR
        },
        specialization: Specialization.SURGEON,
        education: 'Медицинский университет',
        experience: '9 лет',
        description: 'Послеоперационное сопровождение, амбулаторные операции'
      }
    ];
    
    const addedDoctors = [];
    
    // Save doctors to database
    for (const doctorData of sampleDoctors) {
      // Check if user with this email already exists
      const existingUser = await userRepository.findOne({ where: { email: doctorData.user.email } });
      
      if (existingUser) {
        console.log(`User with email ${doctorData.user.email} already exists, skipping`);
        continue;
      }
      
      // Create and save user first
      const user = userRepository.create(doctorData.user);
      await userRepository.save(user);
      
      // Create and save doctor with reference to user
      const doctor = doctorRepository.create({
        userId: user.id,
        specialization: doctorData.specialization,
        education: doctorData.education,
        experience: doctorData.experience,
        description: doctorData.description
      });
      
      await doctorRepository.save(doctor);
      
      // Load the user relationship for the response
      const savedDoctor = await doctorRepository.findOne({
        where: { id: doctor.id },
        relations: ['user']
      });
      
      if (savedDoctor) {
        addedDoctors.push({
          id: savedDoctor.id,
          name: `${savedDoctor.user.firstName} ${savedDoctor.user.lastName}`,
          specialization: savedDoctor.specialization
        });
      } else {
        // Fallback in case the doctor couldn't be loaded with relations
        addedDoctors.push({
          id: doctor.id,
          name: 'Doctor',
          specialization: doctor.specialization
        });
      }
    }
    
    res.status(201).json({
      message: `Added ${addedDoctors.length} sample doctors to the database`,
      doctors: addedDoctors
    });
  } catch (error) {
    console.error('Error adding sample doctors:', error);
    res.status(500).json({ message: 'Failed to add sample doctors', error });
  }
};

// For available slots, see appointments.controller.ts